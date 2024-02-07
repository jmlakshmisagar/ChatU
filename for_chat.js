import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(); 

function getUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        uid1: searchParams.get('uid1'),
        uid: searchParams.get('uid')
    };
}

async function updateUserInterface() {
    const { uid1, uid } = getUrlParams();

    const senderUserData = await fetchUserData(uid1);
    document.getElementById('senderImg').src = senderUserData.photoURL;
    document.getElementById('senderName').textContent = senderUserData.displayName;

    const receiverUserData = await fetchUserData(uid);
    document.getElementById('receiverImg').src = receiverUserData.photoURL;
    document.getElementById('receiverName').textContent = receiverUserData.displayName;
}

updateUserInterface();

async function fetchUserData(uid) {
    const userRef = ref(database, 'users/' + uid);
    const snapshot = await get(userRef); 
    return snapshot.val();
}

// JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const sendMessageButton = document.querySelector('.input button');
    const messageInput = document.querySelector('.input input');
    const livechat = document.querySelector('.livechat');
    const receiverChats = document.querySelector('.receiver .chats');

    sendMessageButton.addEventListener('click', sendMessage);

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== '') {
            const { uid1, uid } = getUrlParams(); 
    
            const chatId = generateChatId(uid1, uid);
    
            const chatRef = ref(database, `chats/${chatId}`);
    
            const newMessageRef = push(chatRef);
            await set(newMessageRef, {
                senderUid: uid1,
                receiverUid: uid,
                message: message
            });
    
            const senderMessageElement = createMessageElement(message, 'sender');
            livechat.appendChild(senderMessageElement);
    
            const receiverMessageElement = createMessageElement(message, 'receiver');
            receiverChats.appendChild(receiverMessageElement);
    
            messageInput.value = '';
        }
    }
    

    // Function to generate a unique chat ID
    function generateChatId(uid1, uid2) {
        const uids = [uid1, uid2].sort();
        return uids[0] + '-' + uids[1];
    }

    function createMessageElement(message, senderType) {
        const messageElement = document.createElement("p");
        messageElement.classList.add('message', senderType);
        messageElement.textContent = message;
        
        messageElement.style.color = "black";
        messageElement.style.margin = "12px 15px";
        messageElement.style.padding = "10px";
        messageElement.style.backgroundColor = "grey";
        messageElement.style.width = "fit-content";
        messageElement.style.borderRadius = "10px";
    
        return messageElement;
    }
    
});



// Function to search for messages where receiverUid matches user's uid and display them
async function displayReceiverMessages(uid1) {
    const chatRef = ref(database, 'chats');
    const snapshot = await get(chatRef);

    snapshot.forEach((childSnapshot) => {
        const chatData = childSnapshot.val();
        if (chatData.receiverUid === uid1) {
            const message = chatData.message;
            const messageElement = createMessageElement(message, 'receiver');
            const oppchattingsElement = document.getElementById('oppchattings');
            oppchattingsElement.appendChild(messageElement);
        }
    });
}

// Get uid1 from the URL query parameters
const { uid1 } = getUrlParams();

displayReceiverMessages(uid1);







function getUid1FromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid1');
}

function constructProfileUrl(uid1) {
    return `profile.html?uid1=${uid1}`;
}

document.getElementById('profileLink').addEventListener('click', function(event) {
    event.preventDefault(); 
    const uid1 = getUid1FromUrl();
    if (uid1) {
        const profileUrl = constructProfileUrl(uid1);
        window.location.href = profileUrl;
    } else {
        console.error('UID1 parameter not found in the URL');
    }
});





document.getElementById('call').addEventListener('click', function(event) {
    event.preventDefault(); 

    const urlParams = new URLSearchParams(window.location.search);
    const uid1 = urlParams.get('uid1');
    const uid = urlParams.get('uid');

    window.location.href = `call.html?uid1=${uid1}&uid=${uid}`;
});



document.getElementById('lobby').addEventListener('click', function() {
    // Alert the user to login again
    alert("Please login again to start a new chat.");

    window.location.href = "login.html";
});
