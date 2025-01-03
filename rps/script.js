let playerChoiceInt = 0;
let aiChoiceInt = 0;
let whoWon = "";
let playerScore = 0;
let aiScore = 0;

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

    switch ((playerChoiceInt, aiChoiceInt))
        {
            case (1, 1):
                whoWon = "none";
                break;

            case (2, 1):
                whoWon = "player";
                break;

            case (3, 1):
                whoWon = "ai";
                break;

            case (1, 2):
                whoWon = "ai";
                break;

            case (2, 2):
                whoWon = "none";
                break;

            case (3, 2):
                whoWon = "player";
                break;

            case (1, 3):
                whoWon = "player";
                break;

            case (2, 3):
                whoWon = "ai";
                break;

            case (3, 3):
                whoWon = "none";
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
}

function updateHTML()
{
    document.getElementById("winner").textContent = `Winner: ${whoWon}`;
    document.getElementById("wins").textContent = `Wins: ${playerScore}`;
    document.getElementById("losses").textContent = `Losses: ${aiScore}`;
    document.getElementById("aiChoice").textContent = `Ai Choice: ${aiChoiceStr}`;
}
