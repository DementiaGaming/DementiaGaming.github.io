let playerChoiceInt = 0;
let aiChoiceInt = 0;
let whoWon = "";
let playerScore = 0;
let aiScore = 0;
let winStreak = 0

// 1 is rock
// 2 is paper
// 3 is scissors

function rockSelected()
{
    playerChoiceInt = 1;
    simulateGame();
}

function paperSelected()
{
    playerChoiceInt = 2;
    simulateGame();
}

function scissorsSelected()
{
    playerChoiceInt = 3;
    simulateGame();
}

function simulateGame()
{
    aiChoiceInt =  Math.floor(Math.random() * 3) + 1;

    switch (`${playerChoiceInt},${aiChoiceInt}`) {
        case "1,1":
        case "2,2":
        case "3,3":
            whoWon = "none";
            break;

        case "2,1":
        case "3,2":
        case "1,3":
            whoWon = "player";
            winStreak++
            break;

        case "2,3":
        case "1,2":
        case "3,1":
            whoWon = "ai";
            winStreak = 0
            break;
    }
        switch (whoWon)
        {
            case "player":
                playerScore++;
                break;

            case "ai":
                aiScore++;
                break;

            case "none":
                break;
        }

        switch (aiChoiceInt)
        {
            case 1:
                aiChoiceStr = "Rock";
                break;
            case 2:
                aiChoiceStr = "Paper";
                break;
            case 3:
                aiChoiceStr = "Scissors";
                break;
        }
    
        updateHTML();

        if (winStreak === 10) {
            unlockAchievement("Unpredicable");
        }
}

function updateHTML()
{
    document.getElementById("winner").textContent = `Winner: ${whoWon}`;
    document.getElementById("wins").textContent = `Wins: ${playerScore}`;
    document.getElementById("losses").textContent = `Losses: ${aiScore}`;
    document.getElementById("aiChoice").textContent = `Ai Choice: ${aiChoiceStr}`;
}

function showAchievementPopup(achievementName) {
    console.log("Trying to show popup for:", achievementName);

    if (!achievementName) {
        console.error("⚠️ ERROR: achievementName is undefined!");
        return;
    }

    const popup = document.getElementById("achievement-popup");
    const text = document.getElementById("achievement-text");

    if (!popup || !text) {
        console.error("⚠️ ERROR: Popup elements not found!");
        return;
    }

    text.innerText = `Achievement Unlocked: ${achievementName}`;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}