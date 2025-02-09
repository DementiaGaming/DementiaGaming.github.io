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
    }, 1000)
}

function animate() {
    requestAnimationFrame(animate)
    button.draw()
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
    }
})

init()