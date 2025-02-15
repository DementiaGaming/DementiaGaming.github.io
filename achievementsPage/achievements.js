document.addEventListener("DOMContentLoaded", () => {
    /*** 🏆 ACHIEVEMENTS SYSTEM ***/
    const achievements = {
        "Orb Novice": "Reach level 10 in Orb Defender",
        "Orb Apprentice": "Reach level 20 in Orb Defender",
        "Orb Master": "Reach level 30 in Orb Defender",
        "Orb Grandmaster": "Reach level 40 in Orb Defender",
        "Orb Legend": "Reach level 50 in Orb Defender",
        "Can't Touch This": "Survive 60 seconds without getting hit in Orb Defender",
        "Master of the Orbs": "Reach 250,000 score in Orb Defender",
        "Big Winner": "Win big in GambleCore",
        "Winner": "Win in GambleCore",
        "All In, All Gone": "Lose all your money in GambleCore",
        "Back from the debt": "Recover from being in debt in GambleCore",
        "99% of gamblers quit before they win big": "Lose 15 times in a row in GambleCore",
        "Begginers Misfortune": "Lose on your first spin in GambleCore",
        "50 spins later...": "Spin the slot machine 50 times in GambleCore",
        "Unpredicable": "Win 10 games in a row in Rock Paper Scissors",
        "Ultimate Power": "Unlock the ultra boost in Clicker Game",
        "Rich Clicker": "Reach $1,000,000 in Clicker Game",
        "Work Smarter, Not Harder": "Buy your first auto clicker in Clicker Game",
        "The Automation Revolution": "Buy 10 auto clickers in Clicker Game",
        "Idle Hands, Big Gains": "Buy 25 auto clickers in Clicker Game",
        "Clicking Empire": "Buy 50 auto clickers in Clicker Game",
        "Why Even Click?": "Buy 100 auto clickers in Clicker Game",
        "Double Gains": "Reach a click multiplier of 2x in Clicker Game",
        "Triple Gains": "Reach a click multiplier of 3x in Clicker Game",
        "Quadruple Gains": "Reach a click multiplier of 4x in Clicker Game",
        "Pentriple Gains": "Reach a click multiplier of 5x in Clicker Game",
        "Ultimate Gains": "Reach a click multiplier of 10x in Clicker Game",
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
            showAchievementPopup(name);
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
