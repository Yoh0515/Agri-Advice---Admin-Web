// Firebase configuration and initialization
const fbConfig = {
    apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
    authDomain: "final-database-9493d.firebaseapp.com",
    databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
    projectId: "final-database-9493d",
    storageBucket: "final-database-9493d.appspot.com",
    messagingSenderId: "798360016853",
    appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

firebase.initializeApp(fbConfig);

const firestore = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

const isLoggedIn = sessionStorage.getItem("isLoggedIn");
console.log(isLoggedIn);
if (!isLoggedIn) {
  window.location.href = "index.html";
}


// If user is not logged in, redirect to login page
if (isLoggedIn == "false") {
    console.log(isLoggedIn);
    window.location.href = "index.html";
    urlred = "index.html";
}

let currentThreadId = null;

function fetchChats() {
    firestore.collection("Seminar").where("participants", "array-contains", "agriadvice123@gmail.com")
    .get()
    .then((querySnapshot) => {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';
        let firstListItem = null; // To store the first list item

        querySnapshot.forEach((doc, index) => {
            const chatData = doc.data();
            const otherParticipant = chatData.participants.find(email => email !== "agriadvice123@gmail.com");
            const listItem = document.createElement('li');
            listItem.className = 'clearfix';
            listItem.setAttribute('data-participant', otherParticipant.toLowerCase()); // Store participant's name in lowercase for search
            listItem.setAttribute('data-thread-id', doc.id); // Store thread ID for later use
            listItem.innerHTML = `
                <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar">
                <div class="about">
                    <div class="name">${otherParticipant}</div>
                    <div class="status"> <i class="fa fa-circle online"></i> online </div>
                </div>
            `;

            listItem.addEventListener('click', () => {
                loadChat(doc.id, otherParticipant);
                // Remove selected-chat class from all list items
                const chatListItems = document.querySelectorAll('#chatList li');
                chatListItems.forEach(item => item.classList.remove('selected-chat'));
                listItem.classList.add('selected-chat');
            });

            chatList.appendChild(listItem);

            if (index === 0) {
                firstListItem = listItem; // Set the first list item
            }
        });

        // Ensure that the first list item is clicked after the DOM has been updated
        if (firstListItem) {
            setTimeout(() => {
                firstListItem.click(); // Simulate click to load the chat
            }, 0);
        }
    });
}

document.getElementById('searchInput').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const chatListItems = document.querySelectorAll('#chatList li');
    chatListItems.forEach(item => {
        const participant = item.getAttribute('data-participant');
        if (participant.includes(searchQuery)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

function loadChat(threadId, participant) {
    currentThreadId = threadId;
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = '';
    document.getElementById('chatHeaderName').innerText = participant;
    document.getElementById('chatHeaderAvatar').src = "https://bootdey.com/img/Content/avatar/avatar2.png";

    firestore.collection(`Seminar/${threadId}/Chats`).orderBy("timestamp", "asc")
    .onSnapshot((querySnapshot) => {
        chatHistory.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const chatData = doc.data();
            const messageItem = document.createElement('li');
            messageItem.className = 'clearfix';
            messageItem.innerHTML = `
                <div class="message-data ${chatData.sender === "agriadvice123@gmail.com" ? 'text-right' : ''}">
                    <span class="message-data-time">${new Date(chatData.timestamp).toLocaleTimeString()}</span>
                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                </div>
                <div class="message ${chatData.sender === "agriadvice123@gmail.com" ? 'other-message float-right' : 'my-message'}">
                    ${chatData.message}
                    ${chatData.images && chatData.images.length > 0 ? renderAttachments(chatData.images) : ''}
                </div>
            `;
            chatHistory.appendChild(messageItem);
        });
    });
}

function renderAttachments(attachments) {
    return attachments.map(attachment => {
        const fileName = getFileNameFromUrl(attachment);
        if (fileName.toLowerCase().includes('.pdf')) {
            return `<div><a href="${attachment}" target="_blank" download="${fileName}">${fileName}</a></div>`;
        } else {
            return `<div><img src="${attachment}" class="img-thumbnail" alt="image"></div>`;
        }
    }).join('');
}

function getFileExtension(fileName) {
    return fileName.split('.').pop();
}

function getFileNameFromUrl(url) {
    const startIndex = url.lastIndexOf('/') + 1;
    return url.substring(startIndex);
}

document.getElementById('sendMessageButton').addEventListener('click', sendMessage);

document.getElementById('attachFileButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', () => {
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    filePreview.innerHTML = '';

    Array.from(fileInput.files).forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const fileUrl = e.target.result;
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';

            if (file.type.startsWith('image/')) {
                previewItem.innerHTML = `<img src="${fileUrl}" class="img-thumbnail" alt="image" style="max-height: 100px;">`;
            } else if (file.type === 'application/pdf') {
                previewItem.innerHTML = `<span>${file.name}</span>`;
            } else {
                previewItem.innerHTML = `<a href="${fileUrl}" target="_blank">${file.name}</a>`;
            }
            filePreview.appendChild(previewItem);
        };
        fileReader.readAsDataURL(file);
    });
});

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    let imageUrls = [];

    if (message !== '' || files.length > 0) {
        if (files.length > 0) {
            const uploadPromises = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = storage.ref().child(`chat_images_seminar/${Date.now()}_${file.name}`);
                uploadPromises.push(storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL()));
            }
            try {
                imageUrls = await Promise.all(uploadPromises);
            } catch (error) {
                console.error("Error uploading files: ", error);
                return;
            }
        }
        saveMessage(message, imageUrls);
    }
}

async function saveMessage(message, imageUrls) {
    const threadId = currentThreadId;
    const path = `Seminar/${threadId}/Chats`;
    try {
        await firestore.collection(path).add({
            message,
            sender: "agriadvice123@gmail.com",
            senderName: "Request Seminar", // Replace with actual sender name if available
            receiver: document.getElementById('chatHeaderName').innerText,
            receiverName: document.getElementById('chatHeaderName').innerText, // Replace with actual receiver name if available
            timestamp: Date.now(),
            images: imageUrls
        });
        document.getElementById('messageInput').value = '';
        document.getElementById('fileInput').value = '';
        document.getElementById('filePreview').innerHTML = '';
    } catch (error) {
        console.error("Error sending message: ", error);
    }
}

fetchChats();