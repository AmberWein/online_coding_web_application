// handles the functionality related to displaying a specific code block
let socket;
let isMentor = false;

if (localStorage.getItem('socketId')) {
  // reconnection
  socket = io(`/?socketId=${localStorage.getItem('socketId')}`);
} else {
  // new socket connection
  socket = io();
  socket.on('connect', () => {
    localStorage.setItem('socketId', socket.id);
  });
}

// get the title from the URL
const urlParams = new URLSearchParams(window.location.search);
const codeBlockTitle = urlParams.get('title');

const codeBlockTitleElement = document.getElementById('codeBlockTitle');
const codeEditorElement = document.getElementById('codeEditor');

// fetch the code block details from the server using the title from the URL
fetch(`/api/codeblocks/${codeBlockTitle}`)
  .then(response => {
    console.log('Response:', response);
    return response.json();
  })
  .then(codeBlock => {
    // set the code block title and initial template in the editor
    codeBlockTitleElement.textContent = codeBlock.title;
    codeEditorElement.textContent = codeBlock.template;
    hljs.highlightElement(codeEditorElement);

    const solutionCode = codeBlock.solution;
    // attach click event to the check button (to check the user's solution)
    document.getElementById('checkButton').addEventListener('click', () => {
      compareCodes(codeEditorElement.textContent, solutionCode);
    });

    // join a room by the code block title (unique room identifier)
    const room = codeBlock.title;
    socket.emit('joinRoom', room);
    
    //
    socket.on('roomInfo', (data) => {
        const { room, clients } = data;
        console.log('Clients in room:', clients);
        // Assume the first user is the mentor
        if (clients.length === 1) {
            console.log('Setting code editor to read-only mode');
            isMentor = true;
            codeEditorElement.setAttribute('contenteditable', false);
        } else {
            console.log('Setting code editor to editable mode');
            codeEditorElement.setAttribute('contenteditable', true);
            // listen for input change in the code editor and send the updated code to the server
            codeEditorElement.addEventListener('input', () => {
                socket.emit('codeChange', {
                    room,
                    code: codeEditorElement.textContent
                });
            });
          }

        //     if (clients.length === 1) {
        //       console.log('Setting code editor to read-only mode');
        //       isMentor = true;
        //       codeEditorElement.setAttribute('contenteditable', false); // Set editor to read-only
        //   } else {
        //       console.log('Setting code editor to editable mode');
        //       codeEditorElement.setAttribute('contenteditable', true);
        // }
    });

    // listen for code changes from the server (if another user modifies the code)
    socket.on('codeChange', (code) => {
        codeEditorElement.textContent = code;
        hljs.highlightElement(codeEditorElement);
    });
  })
  .catch(error => console.error('Error:', error));

  // function to compare the user's code with the solution
  function compareCodes(userCode, solutionCode) {
    // remove spaces and line breaks from both codes 
    const formattedUserCode = removeSpacesAndLineBreaks(userCode);
    const formattedSolutionCode = removeSpacesAndLineBreaks(solutionCode);
    // check if both matche
    if (formattedUserCode === formattedSolutionCode) {
      console.log('codes are matches');
      const smileyDiv = document.createElement('div');
      smileyDiv.textContent = '😃';
      smileyDiv.style.fontSize = '48px';
      smileyDiv.style.textAlign = 'center';
      const smileyContainer = document.getElementById('smileyContainer');
      smileyContainer.appendChild(smileyDiv);
      setTimeout(() => {
        smileyDiv.remove();
      }, 5000);
    } else {
      console.log('wrong');

      // create an error massage element
      const errorMessageDiv = document.createElement('div');
      errorMessageDiv.textContent = 'Error: Codes do not match';
      errorMessageDiv.style.color = 'red';
      errorMessageDiv.style.fontSize = '18px';
      errorMessageDiv.style.textAlign = 'center';
      const errorMessageContainer = document.getElementById('errorMessageContainer');
      errorMessageContainer.appendChild(errorMessageDiv);
      setTimeout(() => {
            errorMessageDiv.remove();
          }, 3000);
      
    }
      
  }
  
  // function to remove all spaces and line breaks from a given string
  function removeSpacesAndLineBreaks(str) {
    return str.replace(/\s/g, '');
  }

