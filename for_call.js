import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
alert("Initializing call. Please wait...");

function getUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        uid1: searchParams.get('uid1'),
        uid: searchParams.get('uid')
    };
}

async function fetchUserData(uid) {
    const userRef = ref(database, 'users/' + uid); 
    const snapshot = await get(userRef);
    return snapshot.val();
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



// JavaScript
document.getElementById('lobby').addEventListener('click', function() {
    alert("Please login again to start a new chat.");

    window.location.href = "login.html";
});

// ------------------------------------------------------------------------------------------//



navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing local media devices:', error);
    });

function setRemoteVideo(stream) {
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = stream;
}

const signalingServerUrl = 'authentication-chatu.firebaseapp.com'; 

const signalingSocket = new WebSocket(signalingServerUrl);

signalingSocket.onopen = () => {
    console.log('Connected to signaling server');
};

signalingSocket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.type === 'offer') {
    } else if (message.type === 'candidate') {
    }
};

function establishPeerConnection() {
    const configuration = { iceServers: [{ urls: 'authentication-chatu.firebaseapp.com' }] }; // Replace with your ICE server configuration

    const peerConnection = new RTCPeerConnection(configuration);

    const localVideoStream = document.getElementById('localVideo').srcObject;
    localVideoStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localVideoStream);
    });

    peerConnection.ontrack = event => {
        setRemoteVideo(event.streams[0]);
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            signalingSocket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };

    peerConnection.createOffer()
        .then(offer => {
            return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
            signalingSocket.send(JSON.stringify({
                type: 'offer',
                offer: peerConnection.localDescription
            }));
        })
        .catch(error => {
            console.error('Error creating offer:', error);
        });
}

establishPeerConnection();




















