const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

const scoreEl = document.getElementById("scoreEl")
const startGameButton = document.getElementById("startGameButton")
const modalEl = document.getElementById("modalEl")
const bigScoreEl = document.getElementById("bigScoreEl")
const timeEl = document.getElementById("timeEl")

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, colour){
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,Math.PI * 2, false)
        c.fillStyle = this.colour
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, colour, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.speed = speed
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,Math.PI * 2, false)
        c.fillStyle = this.colour
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }
}

class Enemy {
    constructor(x, y, radius, colour, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.speed = speed
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,Math.PI * 2, false)
        c.fillStyle = this.colour
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }
}

const friction = 0.99
class Particle {
    constructor(x, y, radius, colour, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.speed = speed
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha;
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,Math.PI * 2, false)
        c.fillStyle = this.colour
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.speed.x *= friction
        this.speed.y *= friction
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
        this.alpha -= 0.01
    }
}

const x = innerWidth / 2
const y = innerHeight / 2

let player = new Player(x, y, 10, "white") 
let projectiles = []
let enemies = []
let particles = []

let spawnSpeed = 1000
let nextDifficulttyIncrease = 5000

let miliseconds = 0
let seconds = 0

function init() {
    player = new Player(x, y, 10, "white") 
    projectiles = []
    enemies = []
    particles = []
    spawnSpeed = 1000
    nextDifficulttyIncrease = 5000
    minutes = 0
    seconds = 0
    timeEl.innerHTML = "0:00"
    score = 0
    scoreEl.innerHTML = score
    timerIntervalID = setInterval(updateTimer, 10)
    setIntervals()
}

function setIntervals() {
    setIntervalID = setInterval(spawnEnemy, spawnSpeed)
    difficultyIntervalID = setInterval(increaseSpawnSpeed, nextDifficulttyIncrease)
}

function updateTimer() {
    if(miliseconds >= 100) {
        seconds++
        miliseconds = 0
    } else {
        miliseconds += 1
    }
    timeEl.innerHTML = `${seconds}:${miliseconds}`
}

function increaseSpawnSpeed() {
    if(spawnSpeed > 300) {
        spawnSpeed -= 100
        nextDifficulttyIncrease += 2500
    }   
    clearInterval(setIntervalID)
    clearInterval(difficultyIntervalID)
    setIntervals()
}

function spawnEnemy() {
    const radius = Math.random() * (30 - 5) + 5 

    let x
    let y

    if (Math.random() < 0.5){
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
        y = Math.random() * canvas.height
    }
    else {
        x = Math.random() * canvas.width
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    
    const colour = `hsl(${Math.random() * 360}, 50%, 50%)`
    
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const speed = {x:Math.cos(angle) , y: Math.sin(angle)}
    
    enemies.push(new Enemy(x,y,radius,colour,speed))
}

let animationID
let score = 0
function animate() {
    animationID = requestAnimationFrame(animate)

    c.fillStyle = "rgba(0, 0, 0, 0.1)"
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw()

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
        
    })

    projectiles.forEach((projectile, index) => {
        projectile.update()

        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update()

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (distance - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationID)
            modalEl.style.display = "flex"
            bigScoreEl.innerHTML = score
            clearInterval(setIntervalID)
            clearInterval(timerIntervalID)
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (distance - enemy.radius - projectile.radius < 1) {

                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(
                        projectile.x,
                        projectile.y, 
                        Math.random() * 2, 
                        enemy.colour, 
                        {x: (Math.random() - 0.5) * (Math.random() * 6), 
                        y: (Math.random() - 0.5) * (Math.random() * 6)}))
                }

                if (enemy.radius - 10 > 5) {
                    score += 100
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
                else{
                    setTimeout(() => {
                        score += 250
                        scoreEl.innerHTML = score
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            }
        })
    }) 
}

addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const speed = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(x, y, 5, "white", speed))
    console.log(angle)
})

startGameButton.addEventListener("click", () => {
    init()
    animate()
    modalEl.style.display = "none"
})