const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d")

const scoreEl = document.getElementById("score")
const autoClickerOwnedEl = document.getElementById("ownedAC")
const clickMultiplierOwnedEl = document.getElementById("ownedCM")

const autoClickerButtonEl = document.getElementById("autoClickerBuy")
const clickMultiplierButtonEl = document.getElementById("clickMultiplierBuy")

const ultraboostButtonEl = document.getElementById("ultraBoostBuy")
const ultraboostStatusEl = document.getElementById("ultraboostIndicator")

canvas.width = innerWidth
canvas.height = innerHeight

let score = 0

let autoClickerOwned = 0
let clickMultiplier = 1

let ultraboostActive = false

let firstAutoClicker = false

// button to click
class Button {
    constructor(clickAmount, size, colour, x, y) {
        this.clickAmount = clickAmount
        this.size = size
        this.colour = colour
        this.x = x
        this.y = y
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.colour
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        c.fill()
    }

    checkClick(event) {
        if (event.clientX < this.x + this.size && event.clientX > this.x - this.size) {
            if (event.clientY < this.y + this.size && event.clientY > this.y - this.size) {
                score += this.clickAmount * clickMultiplier
                scoreEl.innerHTML = `$${Math.floor(score)}`
            }
        }
    }
    
    checkTouch(event) {
        if (event.changedTouches[0].clientX < this.x + this.size && event.changedTouches[0].clientX > this.x - this.size) {
            if (event.changedTouches[0].clientY < this.y + this.size && event.changedTouches[0].clientY > this.y - this.size) {
                score += this.clickAmount * clickMultiplier
                scoreEl.innerHTML = `$${Math.floor(score)}`
            }
        }
    }
}

const middleX = innerWidth / 2
const middleY = innerHeight / 2

let button = new Button(1, 50, "red", middleX, middleY)

function init() {
    animate()
    autoClickInterval = setInterval(() => {
        score += autoClickerOwned * clickMultiplier
        scoreEl.innerHTML = `$${Math.floor(score)}`
        console.log("Auto Clicker Interval")
    }, 1000)
}

function animate() {
    requestAnimationFrame(animate)
    button.draw()
    checkAcievements()
}


addEventListener("click", (event) => {
    console.log(event.clientX, event.clientY)
    button.checkClick(event)
    console.log(score)
})

addEventListener("touchend", (event) => {
    button.checkTouch(event)
    console.log(score)
})

autoClickerButtonEl.addEventListener("click", () => {
    if (score >= 50) {
        score -= 50
        scoreEl.innerHTML = Math.floor(score)
        autoClickerOwned++
        autoClickerOwnedEl.innerHTML = `Owned: ${autoClickerOwned}`
    }
})

clickMultiplierButtonEl.addEventListener("click", () => {
    if (score >= 100) {
        score -= 100
        scoreEl.innerHTML = Math.floor(score)
        clickMultiplier += 0.1
        clickMultiplierOwnedEl.innerHTML = `${clickMultiplier.toFixed(1)}x`
    }
})

ultraboostButtonEl.addEventListener("click", () => {
    if (score >= 100000 && ultraboostActive == false) {
        score -= 100000
        scoreEl.innerHTML = Math.floor(score)
        ultraboostActive = true
        ultraboostStatusEl.innerHTML = "Active"
        setInterval(() => {
            score += autoClickerOwned * clickMultiplier
            scoreEl.innerHTML = `$${Math.floor(score)}`
        }, 10)
        unlockAchievement("Ultimate Power")
    }
})

let lastTouchEnd = 0;
document.addEventListener("touchend", (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {  
        event.preventDefault(); 
    }
    lastTouchEnd = now;
}, false);

function checkAcievements() {
    if (autoClickerOwned >= 1) {
        unlockAchievement("Work Smarter, Not Harder")
    }
    if (autoClickerOwned >= 10) {
        unlockAchievement("The Automation Revolution")
    }
    if (autoClickerOwned >= 25) {
        unlockAchievement("Idle Hands, Big Gains")
    }
    if (autoClickerOwned >= 50) {
        unlockAchievement("Clicking Empire")
    }
    if (autoClickerOwned >= 100) {
        unlockAchievement("Why Even Click?")
    }
    if (clickMultiplier >= 2) {
        unlockAchievement("Double Gains")
    }
    if (clickMultiplier >= 3) {
        unlockAchievement("Triple Gains")
    }
    if (clickMultiplier >= 4) {
        unlockAchievement("Quadruple Gains")
    }
    if (clickMultiplier >= 5) {
        unlockAchievement("Pentriple Gains")
    }
    if (clickMultiplier >= 10) {
        unlockAchievement("Ultimate Gains")
    }
    if (score >= 1000000) {
        unlockAchievement("Rich Clicker")
    }
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

function addScore(amount) { // debugging
    score += amount
    scoreEl.innerHTML = `$${score}`
}

init()