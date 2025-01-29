const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

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

}




init()