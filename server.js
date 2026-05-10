const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();

const wss = new WebSocket.Server({ server });

const socket = new WebSocket("wss://whiteboard-4l8v.onrender.com");

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    draw(data);
};

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
