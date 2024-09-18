const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // An HTTP server to work with both Express and Socket.IO

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// // enable cors middleware
// app.use(cors());

// // set Up a simple test route
// app.get('/', (req, res) => {
//     res.send('Hello, this is the Express server.');
// });

// // test the route
// app.listen(3001, () => {
//     console.log('Server running on port 3001.')
// });

// // handle Socket.IO connections
// io.on('connection', (socket) => {
//     console.log('A new client connected: ', socket.id);
//     socket.emit('message', 'welcome to the socket.io server.');

//     socket.on('chatMessage', (msg) => {
//         console.log('Message from client: ', msg);
//         io.emit('chatMessage', msg);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected: ', socket.id);
//     });
// });

// // start the server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//     console.log(PORT)
//     console.log(`Server is running on port ${PORT}`);
// });

