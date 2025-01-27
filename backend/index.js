const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Make sure this is the correct frontend URL
    }
});

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    // Handle JOIN event (user enters a room)
    socket.on('join', ({ roomId, username }) => {
        console.log(`${username} joined room: ${roomId}`);
        // Emit to others in the room
        socket.join(roomId);
        socket.to(roomId).emit('joined', {
            socketId: socket.id,
            username,
        });
    });

    // Handle DISCONNECTED event (user disconnects)
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Broadcast to room that someone has left
        io.emit('disconnected', { socketId: socket.id });
    });
});

// Make sure the server listens on a specific port
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
