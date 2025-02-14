document.addEventListener("DOMContentLoaded", () => {
    /*** 🏆 ACHIEVEMENTS SYSTEM ***/
    const achievements = {
        "Orb Novice": "Reach level 10 in Orb Defender",
        "Orb Apprentice": "Reach level 20 in Orb Defender",
        "Orb Master": "Reach level 30 in Orb Defender",
        "Orb Grandmaster": "Reach level 40 in Orb Defender",
        "Orb Legend": "Reach level 50 in Orb Defender",
        "Big Winner": "Win big in GambleCore",
        "Winner": "Win in GambleCore",
        "All In, All Gone": "Lose all your money in GambleCore"
    };

    function loadAchievements() {
        let storedAchievements = JSON.parse(localStorage.getItem("achievements")) || {};
        const unlockedList = document.querySelector(".unlocked .achievements-list");
        const lockedList = document.querySelector(".locked .achievements-list");

        if (unlockedList && lockedList) {
            unlockedList.innerHTML = "";
            lockedList.innerHTML = "";

            for (const [name, description] of Object.entries(achievements)) {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${name}:</strong> ${description}`;
                if (storedAchievements[name]) {
                    unlockedList.appendChild(li);
                } else {
                    lockedList.appendChild(li);
                }
            }
        }
    }

    window.unlockAchievement = function(name) {
        const achievements = JSON.parse(localStorage.getItem("achievements")) || {};
        
        if (!achievements[name]) {
            achievements[name] = true;
            localStorage.setItem("achievements", JSON.stringify(achievements));
        }
    };
    

    function resetAchievements() {
        if (confirm("Are you sure you want to reset all achievements? This action cannot be undone!")) {
            localStorage.removeItem("achievements");
            alert("All achievements have been reset.");
            location.reload();
        }
    }

    if (document.getElementById("resetAchievements")) {
        document.getElementById("resetAchievements").addEventListener("click", resetAchievements);
    }

    /*** 🏠 MAIN PAGE BUTTON FUNCTIONALITY ***/
    document.querySelectorAll(".game-button").forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = button.dataset.href;
        });
    });

    /*** ✅ INIT ***/
    loadAchievements();
});
