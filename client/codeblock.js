//Handles the functionality related to displaying a specific code block.
let socket;
let isMentor = false;

if (localStorage.getItem('socketId')) {
  socket = io(`/?socketId=${localStorage.getItem('socketId')}`);
} else {
  socket = io();
  socket.on('connect', () => {
    localStorage.setItem('socketId', socket.id);
  });
}

const urlParams = new URLSearchParams(window.location.search);
const codeBlockTitle = urlParams.get('title');

const codeBlockTitleElement = document.getElementById('codeBlockTitle');
const codeEditorElement = document.getElementById('codeEditor');

fetch(`/api/codeblocks/${codeBlockTitle}`)
  .then(response => {
    console.log('Response:', response);
    return response.json();
  })
  .then(codeBlock => {
    codeBlockTitleElement.textContent = codeBlock.title;
    codeEditorElement.textContent = codeBlock.template; // Set template for initial display
    hljs.highlightElement(codeEditorElement);

    const solutionCode = codeBlock.solution; // Keep this to compare later
    document.getElementById('checkButton').addEventListener('click', () => {
      compareCodes(codeEditorElement.textContent, solutionCode);
    });

    const room = codeBlock.title;
    socket.emit('joinRoom', room);
    
    socket.on('roomInfo', (data) => {
        const { room, clients } = data;
        console.log('Clients in room:', clients);
        // Assume the first user is the mentor
        if (isMentor) {
            console.log('Setting code editor to read-only mode');
            isMentor = false;
            codeEditorElement.setAttribute('contenteditable', false);
        } else {
            console.log('Setting code editor to editable mode');
            codeEditorElement.setAttribute('contenteditable', true);

            codeEditorElement.addEventListener('input', () => {
                socket.emit('codeChange', {
                    room,
                    code: codeEditorElement.textContent
                });
            });
        }
    });

    socket.on('codeChange', (code) => {
        codeEditorElement.textContent = code;
        hljs.highlightElement(codeEditorElement);
    });
  })
  .catch(error => console.error('Error:', error));

  function compareCodes(userCode, solutionCode) {
    
    const formattedUserCode = removeSpacesAndLineBreaks(userCode);
    const formattedSolutionCode = removeSpacesAndLineBreaks(solutionCode);
  
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
      const errorMessageDiv = document.createElement('div');
      errorMessageDiv.textContent = 'Error: Codes do not match. Do not forget to remove the footnote';
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
  
  function removeSpacesAndLineBreaks(str) {
    return str.replace(/\s/g, '');
  }

