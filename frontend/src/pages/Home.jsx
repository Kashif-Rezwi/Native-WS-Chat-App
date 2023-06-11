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
      const timestamp = new Date().toLocaleString().split(",")[1];
      const message = { text, timestamp, ...user };
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
        setChat((prevChat) => [...prevChat, message]);
      }
    }
    setText("");
  };

  return (
    <section>
      <div className="mainBox">
        {chat.length > 0 ? (
          <ScrollToBottom className="onlineBox">
            {clients.map((client, i) => {
              return <p key={i}>{client} join the chat room.</p>;
            })}
          </ScrollToBottom>
        ) : (
          <div className="onlineBox">
            <p>No online user is found!</p>
          </div>
        )}

        {user ? (
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
                  <div
                    style={{
                      alignItems:
                        user.id === msg.id ? "flex-end" : "flex-start",
                    }}
                  >
                    <p
                      style={{
                        backgroundColor:
                          user.id === msg.id ? "#1762ea" : "#7b9acc",
                      }}
                    >
                      {msg.text}
                    </p>
                    {user !== msg.user && (
                      <p
                        style={{
                          color: user.id === msg.id ? "#6a9fff" : "#7b9acc",
                          textAlign: user.id === msg.id ? "right" : "left",
                        }}
                      >
                        {user.id === msg.id
                          ? `${msg.client} ${msg.timestamp}`
                          : `${msg.timestamp} ${msg.client}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        ) : (
          <div className="joiningMsg">
            <h1>Please enter your username to join the chat room.</h1>
          </div>
        )}

        <div className="sendMsgBox">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder={
              !user
                ? "Enter your username here..."
                : "Type your message here..."
            }
          />
          <button onClick={(e) => handleSubmit(e)}>
            {!user ? "Enter" : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
};
