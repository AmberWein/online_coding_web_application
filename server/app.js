require('dotenv').config()

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const CodeBlock = require('./models/codeblocks');

const app = express();
const server = http.createServer(app); // An HTTP server to work with both Express and Socket.IO

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

app.use(express.json())
app.use(cors()); // enable CORS middleware
app.use('/api', routes);

// Mongoose connection
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', (error) => console.log('Connected to Database'));

// route to get all code blocks
app.get('/codeblocks', async (req, res) => {
    try {
        const CodeBlocks = await CodeBlock.find();
        res.json(CodeBlocks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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
