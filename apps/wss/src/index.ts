import { WebSocketServer, WebSocket } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  const user = new User(ws);

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.ping();
      } catch {}
    }
  }, 30000);

  ws.on("close", () => {
    clearInterval(interval);
    user.destroy();
  });

  ws.on("error", () => {
    try {
      ws.close();
    } catch {}
  });
});

console.log("ws://localhost:3001");
