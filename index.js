// import dependencies
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');

// create Express app and server
const app = express();
const server = http.createServer(app);

// initialize Socket.IO and set CORS policy
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// store connected users
let connectedUsers = [];

// WebSocket event handling
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


    socket.on("getConnectedUsers", (userId, username) => {

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

// start server
const port = process.env.PORT || 8030;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});