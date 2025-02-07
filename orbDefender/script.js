const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

const scoreEl = document.getElementById("scoreEl")
const startGameButton = document.getElementById("startGameButton")
const modalEl = document.getElementById("modalEl")
const bigScoreEl = document.getElementById("bigScoreEl")
const timeEl = document.getElementById("timeEl")
const levelEl = document.getElementById("levelEl")
const xpBar = document.getElementById("xpBar");

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
let nextDifficulttyIncrease = 10000

let miliseconds = 0
let seconds = 0

let scoreMultiplier = 1.0

let level = 1
let xp = 0
let maxXP = 100

let damage = 10

function addXP(amount) {
    xp += amount;
    if (xp >= maxXP) {
        xp -= maxXP;
        levelUp();
    }

    updateXPBar();
}

function updateXPBar() {
    let xpPercentage = (xp / maxXP) * 100;
    xpBar.style.width = `${xpPercentage}%`;
}

function levelUp() {
    level++;
    levelEl.textContent = level;
    maxXP += 20; // xp requirement increases
    xp = 0;
}

// testing(delete later)
//document.addEventListener("click", () => addXP(10));

function init() {
    player = new Player(x, y, 30, "white") 
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
    scoreMultiplier = 1.0
    xp = 0;
    level = 1;
    maxXP = 100;
    updateXPBar();
    levelEl.textContent = level;
    damage = 10
    timerIntervalID = setInterval(updateTimer, 10)
    bonusScoreID = setInterval(addBonusScore, 1000)
    setIntervals()
}

function setIntervals() {
    setIntervalID = setInterval(spawnEnemy, spawnSpeed)
    difficultyIntervalID = setInterval(increaseSpawnSpeed, nextDifficulttyIncrease)
}

function updateTimer() {
    scoreEl.innerHTML = score
    if(miliseconds >= 100) {
        seconds++
        miliseconds = 0
    } else {
        miliseconds += 1
    }
    timeEl.innerHTML = `${seconds}:${miliseconds}`
}

function addBonusScore() {
    switch (seconds) {
        case 10:
            score += 100
            scoreMultiplier = 1.1
            addXP(50)
            break;
        case 20:
            score += 250
            scoreMultiplier = 1.2
            addXP(100)
            break;
        case 30:
            score += 500
            scoreMultiplier = 1.3
            addXP(150)
            break;
        case 45:
            score += 750
            scoreMultiplier = 1.4
            addXP(200)
            break;
        case 60:
            score += 1000
            scoreMultiplier = 2.0
            addXP(250)
            break;
        case 75:
            score += 1500
            scoreMultiplier = 2.5
            addXP(300)
            break;
        case 90:
            score += 2000
            scoreMultiplier = 3.0
            addXP(400)
            break;
        case 105:
            score += 2500
            scoreMultiplier = 4.0
            addXP(500)
            break;
        case 120:
            score += 5000
            scoreMultiplier = 5.0
            addXP(600)
            break;
    }
}

function increaseSpawnSpeed() {
    if(spawnSpeed > 300) {
        spawnSpeed -= 100
        nextDifficulttyIncrease += 10000
    } else if (spawnSpeed > 100) {
        spawnSpeed -= 50
        nextDifficulttyIncrease += 10000
    }   
    clearInterval(setIntervalID)
    clearInterval(difficultyIntervalID)
    setIntervals()
}

function spawnEnemy() {
    let radius
    if (level <= 10) {
        radius = Math.random() * (30 - 5) + 5 
    }
    else if (level <= 20) {
        radius = Math.random() * (40 - 5) + 5
    }
    else if (level <= 30) {
        radius = Math.random() * (50 - 5) + 5
    }
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
            clearInterval(difficultyIntervalID)
            clearInterval(timerIntervalID)
            clearInterval(bonusScoreID)
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

                if (enemy.radius - damage > 5) {
                    score += Math.floor((100 * scoreMultiplier))
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - damage
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                    addXP(10)
                }
                else{
                    setTimeout(() => {
                        score += Math.floor((250 * scoreMultiplier))
                        scoreEl.innerHTML = score
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                        addXP(20)
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