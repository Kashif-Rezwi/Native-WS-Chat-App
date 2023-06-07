const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is on air.");
});

const server = app.listen(8080, () => {
  console.log("Server started on port 8080");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket Connection.");

  ws.on("message", (msg) => {
    console.log("Received", msg);
  });

  ws.on("close", () => {
    console.log("WebSocket Connection Closed.");
  });
});
