// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD05szBZ5VCfZn_qQUd3kJd_CeaiaiwMLk",
    authDomain: "orb-defender-leaderboard.firebaseapp.com",
    projectId: "orb-defender-leaderboard",
    storageBucket: "orb-defender-leaderboard.firebasestorage.app",
    messagingSenderId: "391417318379",
    appId: "1:391417318379:web:6d7e5b21dd9a3dbd73a7ae",
    measurementId: "G-45ECVLT6HE"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Show the correct form (login or signup)
function showForm(form) {
    if (form === 'signup') {
        document.getElementById('signup-form').classList.remove('hidden');
        document.getElementById('signin-form').classList.add('hidden');
    } else {
        document.getElementById('signin-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
    }
}

// Sign up function
function signUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const username = document.getElementById('signup-username').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Update user profile with username
            user.updateProfile({
                displayName: username
            }).then(() => {
                showSignedInView(user.displayName);
            });
        })
        .catch((error) => {
            console.error("Error signing up:", error.message);
        });
}

// Login function
function login() {
    const email = document.getElementById('login-username-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem("username", user.displayName);
            showSignedInView(user.displayName);
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
        });
}

// Log out function
function logOut() {
    auth.signOut().then(() => {
        // Remove username from localStorage
        localStorage.removeItem("username");
        // Show the auth container and hide signed-in view
        document.getElementById('signed-in-view').style.display = 'none';
        document.getElementById('auth-container').style.display = 'block';
        showForm('login');
    }).catch((error) => {
        console.error("Error signing out:", error.message);
    });
}

// Go home function (example placeholder)
function goHome() {
    window.location.href = "../mainPage/index.html";
}

// Show signed-in view with username
function showSignedInView(username) {
    document.getElementById('auth-container').style.display = 'none';  // Hide auth container
    document.getElementById('signed-in-view').style.display = 'block';  // Show signed-in view
    document.getElementById('username-display').innerText = username;
}

// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    console.log("Auth state changed"); // Debugging log
    if (user) {
        showSignedInView(user.displayName);
        localStorage.setItem("username", user.displayName);
    } else {
        document.getElementById('signed-in-view').style.display = 'none'; // Hide signed-in view
        document.getElementById('auth-container').style.display = 'block'; // Show auth container
        showForm('login');
    }
});

// Check if the user is logged in and return the username or a guest name
function getUsername() {
    const user = firebase.auth().currentUser;
    
    if (user) {
        return user.displayName;  // Returns the username if logged in
    } else {
        // Generate a unique guest username (e.g., Gur1, Gur2, ...)
        const guestNumber = Math.floor(Math.random() * 1000) + 1;
        return `Guest${guestNumber}`;
    }
}

// Check username from localStorage on page load
window.onload = function() {
    const username = localStorage.getItem('username');
    if (username) {
        showSignedInView(username);
    } else {
        showForm('login');
    }
};
