const http = require("http");
const { Server } = require("socket.io");

let connectedUsers = [];
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
const server = http.createServer((req, res) => {
  if (req.url === "/socket.io/") {

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      // Handle join event
      socket.on("join", (userId, username) => {
        console.log("User joined", userId);

        // Add the user to the list of connected users
        connectedUsers.push({ userId, username, socketId: socket.id });

        // Send the updated list of connected users to all connected clients
        io.emit("connectedUsers", connectedUsers);
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

        // Remove the user from the list of connected users
        connectedUsers = connectedUsers.filter(
          (user) => user.socketId !== socket.id
        );

        // Send the updated list of connected users to all connected clients
        io.emit("connectedUsers", connectedUsers);
      });
    });

    res.writeHead(200);
    res.end();
  } else {
    res.writeHead(200);
    res.end();
  }
});

server.listen(4000, () => {
  console.log("Server started on port 4000");
});
