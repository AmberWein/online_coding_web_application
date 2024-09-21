// const codeblocks = require("../server/models/codeblocks");

let socket;

// check if socketId exist in localStorage
if (localStorage.getItem('socketId')) {
    // if it is, establish a socket connection using the stored socketId
    // socket = io(`/?socketId=${localStorage.getItem('socketId')}`);
    socket = io(`http://localhost:3001/?socketId=${localStorage.getItem('socketId')}`);
} else {
    // if not, establish a new connection
    // socket = io();
    socket = io('http://localhost:3001');
    // Once connected, store the new socketId in localStorage
    socket.on('connect', () => {
        localStorage.setItem('socketId', socket.id);
    });
}