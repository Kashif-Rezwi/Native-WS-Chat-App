const express = require("express");
const { WebSocketServer } = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is on air.");
});

const server = app.listen(8080, () => {
  console.log("Server started on port 8080");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (client) => {
  console.log("New WebSocket Connection.");

  client.on("message", (msg) => {
    // parsing the buffer data
    const messageData = JSON.parse(msg);
    console.log("Received", messageData);

    // sends message to all the clients except himself
    [...wss.clients]
      .filter((c) => c !== client)
      .forEach((el) => el.send(JSON.stringify(messageData))); // stringify the parse data
  });

  client.on("close", () => {
    console.log("WebSocket Connection Closed.");
  });
});
