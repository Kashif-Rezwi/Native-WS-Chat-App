import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { findUnique } from "../components/findUnique";

const ws = new WebSocket("ws://localhost:8080");

export const Home = () => {
  const [chat, setChat] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");

  const clients = findUnique(chat);

  ws.onopen = () => {
    console.log("WebSocket Connection Established Successfully.");
  };

  ws.onclose = () => {
    console.log("WebSocket Connection Closed.");
  };

  ws.onmessage = (event) => {
    const message = event.data;
    setChat((prevChat) => [...prevChat, JSON.parse(message)]); // parsing the buffer data
  };

  ws.onerror = (error) => {
    console.log("WebSocket error", error);
  };

  const handleSubmit = () => {
    const message = { text, user };
    if (!user) {
      setUser(text);
    } else {
      ws.send(JSON.stringify(message));
      setChat((prevChat) => [...prevChat, message]);
    }
    setText("");
  };

  return (
    <div>
      <h1>Wellcome to the ws chat app.</h1>

      {chat.length > 0 && (
        <div className="onlineBox">
          {clients.map((client, i) => {
            return <p key={i}>{client}</p>;
          })}
        </div>
      )}

      {user && (
        <ScrollToBottom className="chatBox">
          {chat.map((msg, i) => {
            return (
              <div
                key={i}
                style={{ float: user === msg.user ? "right" : "left" }}
                className="msgBox"
              >
                <p>{msg.text}</p>
                {user !== msg.user && (
                  <p style={{ margin: "0px", fontSize: "12px", float: "left" }}>
                    by {msg.user}
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
