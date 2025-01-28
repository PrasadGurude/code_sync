const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Change this based on your frontend URL
    }
});

const userSocketMap = {};  // Maps socketId -> username
const roomCodeMap = {};  // Stores the latest code for each room

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    // Handle JOIN event (user enters a room)
    socket.on('join', ({ roomId, username }) => {
        console.log(`${username} joined room: ${roomId}`);
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        io.to(roomId).emit('joined', { clients, username, socketId: socket.id });

        // Send the latest code to the newly joined client
        if (roomCodeMap[roomId]) {
            socket.emit('code_sync', { code: roomCodeMap[roomId] });
        }
    });

    // Handle real-time code changes
    socket.on('code_change', ({ roomId, code }) => {
        roomCodeMap[roomId] = code; // Store latest code for the room
        io.to(roomId).emit('code_change', { code });
    });

    // Handle user disconnection
    socket.on('disconnecting', () => {
        console.log(`User disconnected: ${socket.id}`);

        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            });
        });

        delete userSocketMap[socket.id];
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
