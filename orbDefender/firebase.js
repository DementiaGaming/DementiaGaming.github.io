// ✅ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, orderBy, query } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD05szBZ5VCfZn_qQUd3kJd_CeaiaiwMLk",
    authDomain: "orb-defender-leaderboard.firebaseapp.com",
    projectId: "orb-defender-leaderboard",
    storageBucket: "orb-defender-leaderboard.firebasestorage.app",
    messagingSenderId: "391417318379",
    appId: "1:391417318379:web:6d7e5b21dd9a3dbd73a7ae",
    measurementId: "G-45ECVLT6HE"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Submit Name & Score to Firestore
export async function submitScore(name, score) {
    if (!name || !score) {
        console.error("Name and score are required!");
        return;
    }

    try {
        await addDoc(collection(db, "leaderboard"), {
            name: name,
            score: score,
            timestamp: new Date()
        });

        console.log(`Score submitted: ${name} - ${score}`);
        fetchLeaderboard(); // Refresh leaderboard after submission
    } catch (error) {
        console.error("Error submitting score:", error);
    }
}

export async function fetchLeaderboard() {
    try {
        const leaderboardRef = collection(db, "leaderboard");
        const q = query(leaderboardRef, orderBy("score", "desc")); // Order by highest score
        const querySnapshot = await getDocs(q);

        let leaderboardData = [];
        querySnapshot.forEach((doc) => {
            leaderboardData.push(doc.data());
        });

        console.log("Leaderboard Data:", leaderboardData);
        updateLeaderboardUI(leaderboardData); // Update the UI with fetched data
        return leaderboardData;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}

// Function to update the leaderboard UI
function updateLeaderboardUI(data) {
    const leaderboardEl = document.getElementById("leaderboard");
    if (!leaderboardEl) return;

    leaderboardEl.innerHTML = ""; // Clear existing leaderboard

    data.forEach((player, index) => {
        const li = document.createElement("li");
        li.classList.add("p-2", "rounded", "mb-1", "flex", "justify-between", "items-center", "bg-gray-700");
        li.innerHTML = `
            <span class="font-semibold">#${index + 1} ${player.name}</span>
            <span class="text-yellow-400 font-bold">${player.score}</span>
        `;
        leaderboardEl.appendChild(li);
    });
}

// Fetch leaderboard on page load
fetchLeaderboard();
