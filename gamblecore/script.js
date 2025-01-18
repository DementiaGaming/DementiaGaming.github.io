const slot1El = document.getElementById("slot1")
const slot2El = document.getElementById("slot2")
const slot3El = document.getElementById("slot3")
const spinButton = document.querySelector('button');
const winIndicator = document.querySelector('.win-indicator');
const moneyEl = document.getElementById("money")
const gambleMessage = document.getElementById("gambleMessage")
const reels = document.querySelectorAll('.reel');

let money = 100
let slot1 = ""
let slot2 = ""
let slot3 = ""
let randomNum = 0
let winAmount = 0
let slotIcons = ["placeholder","🍒","🍋","🍇","🍍","🍊","⭐","💎"] //placeholder because random num generates 1-7 while start of list is 0
let winType = ""
let loseStreak = 0

moneyEl.innerHTML = `Money: $${money}`

/*
all slot icons:
🍒
🍋
🍇
🍍
🍊
⭐
💎
*/

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function spinMachine() {
    gambleMessage.innerHTML = "Let's go gambling"
    money -= 10
    randomNum = Math.floor((Math.random() * 7) + 1)
    slot1 = slotIcons[randomNum]
    randomNum = Math.floor((Math.random() * 7) + 1)
    slot2 = slotIcons[randomNum]
    randomNum = Math.floor((Math.random() * 7) + 1)
    slot3 = slotIcons[randomNum]

    slot1El.innerHTML = slot1
    await delay(500)
    slot2El.innerHTML = slot2
    await delay(500)
    slot3El.innerHTML = slot3
    checkWinnings()
}

function checkWinnings() {
    if (slot1 == "💎" && slot2 == "💎" && slot3 == "💎") {
        winAmount = 1000
        money += winAmount
        winType = "big-win"
        loseStreak = 0
        gambleMessage.innerHTML = "You win big!"
    }
    else if(slot1 == "⭐" && slot2 == "⭐" && slot3 == "⭐") {
        winAmount = 500
        money += winAmount
        winType = "win"
        loseStreak = 0
        gambleMessage.innerHTML = "You win!"
    }
    else if (slot1 == slot2 && slot2 == slot3){
        winAmount = 100
        money += winAmount
        winType = "win"
        loseStreak = 0
        gambleMessage.innerHTML = "You win!"
    }
    else {
        winType = "lose"
        winAmount = 0
        loseStreak++
    }
    displayAnimations()
}

function displayAnimations() {
    if (winType == "lose" && loseStreak < 15) {
        loseStreak++
        gambleMessage.innerHTML = "Aw dang it"
    } else if (winType == "lose" && loseStreak >= 15) {
        gambleMessage.innerHTML = "99% of gamblers quit before they win big"
    }

    moneyEl.innerHTML = `Money: $${money}`
    winIndicator.textContent = `You won $${winAmount}!`;
    winIndicator.classList.add('show');

    setTimeout(() => {
        winIndicator.classList.remove('show');
    }, 2000);

    reels.forEach((reel, index) => {
        reel.classList.add(winType);
    });

    spinButton.classList.remove('disabled');
}

spinButton.addEventListener('click', () => {
    spinButton.classList.add('disabled');
    reels.forEach(reel => {
        reel.classList.remove('win', 'lose', 'big-win');
    });
    spinMachine()
});
