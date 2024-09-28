let socket;
const socketUrl = 'https://onlinecodingwebapplication-production.up.railway.app';

// check if socketId exist in localStorage
if (localStorage.getItem('socketId')) {
    // if it is, establish a socket connection using the stored socketId
    // socket = io(`/?socketId=${localStorage.getItem('socketId')}`);
    // socket = io(`${socketUrl}/?socketId=${localStorage.getItem('socketId')}`);
    socket = io(socketUrl, {
        query: { socketId: localStorage.getItem('socketId') }
    });
} else {
    // if not, establish a new connection
    // socket = io();
    socket = io(socket);
    // Once connected, store the new socketId in localStorage
    socket.on('connect', () => {
        localStorage.setItem('socketId', socket.id);
    });
}

// fetch code blocks from the server
fetch('https://onlinecodingwebapplication-production.up.railway.app/api/codeblocks')
    .then(response => {
        if(!response) {
            throw new Error('Network response was not good.');
        }
        return response.json();
    })
    .then(codeblocks => {
        const codeBlockList = document.getElementById('codeBlockList');
        codeBlockList.innerHTML = "";

        // for each fetched code block create a list item
        codeblocks.forEach(codeBlock => {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');

            // set anchor element:
            // href to link to the corresponding code block page and the visible text to it's title
            anchor.href = `/codeblock.html?title=${encodeURIComponent(codeBlock.title)}`;
            anchor.textContent = codeBlock.title;

            listItem.appendChild(anchor);
            codeBlockList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching code blocks: ', error);
    });
