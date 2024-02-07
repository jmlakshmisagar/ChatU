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
alert("Please select a user to initiate a conversation.");

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase();
function fetchAndDisplayUsers() {
    const usersRef = ref(database, 'users');

    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userContainer = document.getElementById('Users');
            userContainer.innerHTML = '';

            const urlParams = new URLSearchParams(window.location.search);
            const uidOpposite = urlParams.get('uid');

            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const uid = childSnapshot.key; // Get the user UID
                const displayName = userData.displayName;
                const photoURL = userData.photoURL;

                const userElement = document.createElement('div');
                userElement.classList.add('user');

                const userImage = document.createElement('img');
                userImage.src = photoURL;
                userImage.alt = displayName;

                const userName = document.createElement('p');
                userName.textContent = displayName;

                userElement.addEventListener('click', () => {
                    const newUrl = `chat.html?uid1=${uidOpposite}&uid=${uid}`;
                    window.location.href = newUrl;
                });

                userElement.appendChild(userImage);
                userElement.appendChild(userName);

                userContainer.appendChild(userElement);
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error('Error fetching users:', error);
    });
}

fetchAndDisplayUsers();
