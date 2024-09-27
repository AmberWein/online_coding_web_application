require('dotenv').config()

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');

const app = express();
const server = http.createServer(app); // An HTTP server to work with both Express and Socket.IO

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// Mongoose connection
mongoose.connect('mongodb://mongo:pkrRnYSWSMdXjuQwDsQpakYuHFhYJVbp@mongodb.railway.internal:27017')
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', (error) => console.log('Connected to Database'));

app.use(express.static(path.join(__dirname, '../client')));
app.use('/api', routes);

// web socket handling
const connectedClient = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');

    const socketId = socket.handshake.query.socketId;
    if(socketId && connectedClient.has(socketId)) {
        // reconnection
        const existingSocket = connectedClient.get(socketId);
        socket.join(existingSocket.rooms);
        connectedClient.set(socketId, socket);
    } else {
        // new connection
        connectedClient.set(socket.id, socket);
    }

    socket.on('joinRoom', (room) => {
        const clients = io.sockets.adapter.rooms.get(room)?.size || 0;

        socket.join(room);
        console.log(`User joined room ${room}`);

        io.to(room).emit('roomInfo', { room, clients });
    });

    socket.on('codeChange', (data) => {
        socket.broadcast.to(data.room).emit('codeChange', data.code);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        connectedClient.delete(socket.id);
    });
});

// start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

