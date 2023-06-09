import { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { findUnique } from "../components/findUnique";
import { v4 as uuidv4 } from "uuid";

export const Home = () => {
  const [chat, setChat] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  const clients = findUnique(chat);
  let ws = useRef(null);

  useEffect(() => {
    // if (!ws) {
    // ws = new WebSocket("ws://localhost:8080");
    ws.current = new WebSocket("wss://ws-chat-server-one.onrender.com/");

    ws.current.onopen = () => {
      console.log({ Status: "WebSocket server is connected successfully." });
    };

    ws.current.onclose = () => {
      console.log({ Status: "WebSocket Connection is Closed." });
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setChat((prevChat) => [...prevChat, message]);
      console.log(message);
    };

    ws.current.onerror = (error) => {
      console.log({ Status: "WebSocket error", error });
    };
    // }

    // RETURN CODE IS NOT WORKING
    return () => {
      if (ws.current) {
        const updatedChat = chat.map((msg) => {
          if (msg.id === user.id) {
            return {
              ...msg,
              active: false,
            };
          }

          return msg;
        });
        ws.send(updatedChat);

        ws.current.close(); // Clean up WebSocket connection on component unmount
      }
    };
  }, []);

  const handleSubmit = () => {
    const id = uuidv4();
    const clientDetails = { client: text, id, active: true };
    if (!user) {
      setUser(clientDetails);
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(clientDetails));
        setChat((prevChat) => [...prevChat, clientDetails]);
      }
    } else {
      const message = { text, ...user };
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
        setChat((prevChat) => [...prevChat, message]);
      }
    }
    setText("");
  };

  return (
    <div>
      <h1>Wellcome to the ws chat app.</h1>

      {chat.length > 0 ? (
        <div className="onlineBox">
          {clients.map((client, i) => {
            return <p key={i}>{client}</p>;
          })}
        </div>
      ) : (
        <div className="onlineBox">
          <p>No online users found!</p>
        </div>
      )}

      {user && (
        <ScrollToBottom className="chatBox">
          {chat.map((msg, i) => {
            if (!msg.text) {
              return;
            }

            return (
              <div
                key={i}
                style={{
                  float: user.id === msg.id ? "right" : "left",
                }}
                className="msgBox"
              >
                <p
                  style={{
                    width: "100%",
                    textAlign: user.id === msg.id ? "right" : "left",
                  }}
                >
                  {msg.text}
                </p>
                {user !== msg.user && (
                  <p
                    style={{
                      margin: "0px",
                      fontSize: "12px",
                      float: "left",
                    }}
                  >
                    by {msg.client}
                  </p>
                )}
              </div>
            );
          })}
        </ScrollToBottom>
      )}

      <div className="sendMsgBox">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder={
            !user ? "Enter your username here..." : "Type your message here..."
          }
        />
        <button onClick={(e) => handleSubmit(e)}>
          {!user ? "Enter" : "Send"}
        </button>
      </div>
    </div>
  );
};
