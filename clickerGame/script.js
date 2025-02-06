const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d")

const scoreEl = document.getElementById("score")
const autoClickerOwnedEl = document.getElementById("ownedAC")
const clickMultiplierOwnedEl = document.getElementById("ownedCM")

const autoClickerButtonEl = document.getElementById("autoClickerBuy")
const clickMultiplierButtonEl = document.getElementById("clickMultiplierBuy")

canvas.width = innerWidth
canvas.height = innerHeight

let score = 0

let autoClickerOwned = 0

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
        if (event.clientX < this.x + this.size && event.clientX > this.x - this.size)
            if (event.clientY < this.y + this.size && event.clientY > this.y - this.size)
                score += this.clickAmount
                scoreEl.innerHTML = score
    }
}

const middleX = innerWidth / 2
const middleY = innerHeight / 2

let button = new Button(1, 50, "red", middleX, middleY)

function init() {
    animate()
}

function animate() {
    requestAnimationFrame(animate)
    button.draw()
    //console.log(score)

}


addEventListener("click", (event) => {
    console.log(event.clientX, event.clientY)
    button.checkClick(event)
})

autoClickerButtonEl.addEventListener("click", () => {
    if (score >= 50) {
        score -= 50
        scoreEl.innerHTML = score
        autoClickerOwned++
        autoClickerOwnedEl.innerHTML = `Owned: ${autoClickerOwned}`
    }
})

clickMultiplierButtonEl.addEventListener("click", () => {

})

init()