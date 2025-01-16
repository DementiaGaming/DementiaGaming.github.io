const canvas = document.getElementById("canvas");
const c = canvas.getContext('2d');

const livesEl = document.getElementById("lives")
const roundCounterEl = document.getElementById("roundCounter")
const moneyEl = document.getElementById("money")

canvas.width = 1920;
canvas.height = 1080;

c.font = "20px Arial";
c.textAlign = "center";
c.textBaseline = "middle";

const image = new Image();
image.onload = () => {
    animate()
}
image.src = `images/map.png`;

class Enemy {
    constructor(health, speed, damage) {
        this.health = health
        this.speed = speed
        this.damage = damage
        this.xPos = -100
        this.yPos = 330
        this.waypoint = 0
    }

    draw() {
        c.fillRect(this.xPos,this.yPos,50,50);
    }
}

class BuildSquares {
    constructor(cost) {
        this.xPos = 300
        this.yPos = 200
        this.width = 55
        this.height = 50
        this.buildStatus = "green"
        this.cost = cost // not built
        this.cooldownTime = 1000 // ms
        this.cooldown = false
    }

    draw() {
        c.fillStyle = this.buildStatus
        c.fillRect(this.xPos,this.yPos,this.width,this.height);
        c.fillStyle = "black"
        if (this.buildStatus == "green") {
            c.fillText("$100", 327, 225)
        }
    }

    checkClick(event) {
        if (event.clientX > this.xPos && event.clientX < this.xPos + this.width) {
            if (event.clientY > this.yPos && event.clientY < this.yPos + this.height) {
                // add build logic 
                if (money - this.cost >= 0) {
                    this.buildStatus = "blue"
                    money -= this.cost
                }
            }
        }
    }

    checkEnemiesInRange() {
        if (this.buildStatus == "blue") {
            enemies.forEach((enemy) => {
                if (enemy.xPos < 400 && enemy.xPos > 200) {
                    console.log("g")
                    this.attack()
                }
            })
        }
    }

    attack() {
        if (!this.cooldown) {
            projectiles.push(new Projectile(100, 200, 10, 1))
        }
    }
}

class Projectile {
    constructor(x, y, radius, speed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = "red"
        this.speed = speed
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,Math.PI * 2, false)
        c.fillStyle = this.colour
        c.fill()
        c.fillStyle = "black"
    }

    update() {
        this.draw()
        this.x = this.x + this.speed.x
        this.y = this.y + this.speed.y
    }
}

let enemies = []
let projectiles = []

let roundEnded = true
let round = 0
let enemiesToSpawn = 5
let enemiesSpawned = 0
let spawningFinished = true

let money = 100 
let lives = 100

let buildSquare1 = new BuildSquares(100)

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "grey"
    c.fillRect(0,0,canvas.width, canvas.height)
    c.fillStyle = "black"
    c.drawImage(image, 0, 0);
    moneyEl.innerHTML = `Money: $${money} `
    enemies.forEach(enemy => {
        enemy.draw()
    });
    buildSquare1.draw()
    buildSquare1.checkEnemiesInRange()
    //console.log(enemies.length)

    projectiles.forEach((projectile) => {
        projectile.update()
    })

    console.log(projectiles)

    checkWaypoints()
    decideEnemyMovement()
    checkRoundEnd()
}

function checkWaypoints() {
    enemies.forEach((enemy, index) => {
        if (enemy.waypoint == 0) {
            if (enemy.xPos >= 195) {
                enemy.waypoint = 1
            }
        }
        else if (enemy.waypoint == 1) {
            if (enemy.yPos <= 100) {
                enemy.waypoint = 2
            }
        }
        else if (enemy.waypoint == 2) {
            if (enemy.xPos >= 525) {
                enemy.waypoint = 3
            }
        }
        else if (enemy.waypoint == 3) {
            if (enemy.yPos >= 290) {
                enemy.waypoint = 4
            }
        }
        else if (enemy.waypoint == 4) {
            if (enemy.xPos <= 430) {
                enemy.waypoint = 5
            }
        }
        else if (enemy.waypoint == 5) {
            if (enemy.yPos >= 480) {
                enemy.waypoint = 6
            }
        }
        else if (enemy.waypoint == 6) {
            if (enemy.xPos >= 760) {
                enemy.waypoint = 7
            }
        }
        else if (enemy.waypoint == 7) {
            if (enemy.yPos <= 190) {
                enemy.waypoint = 8
            }
        }
        else if (enemy.waypoint == 8) {
            if (enemy.xPos >= 942) {
                loseLife(enemy, index)
            }
        }
    })
}

function decideEnemyMovement() {
    enemies.forEach((enemy) => {
        switch (enemy.waypoint) {
            case 0:
            case 2:
            case 6:
            case 8:
                moveEnemyX(enemy)
                break
            case 4:
                moveEnemyXBack(enemy)
                break
            case 1:
            case 7:
                moveEnemyYUp(enemy)
                break
            case 3:
            case 5:
                moveEnemyYDown(enemy)
                break
        }
    })
}

function loseLife(enemy, index) {
    lives -= enemy.damage
    livesEl.innerHTML = `Lives: ${lives}`
    enemies.splice(index, 1)
}

let roundMultiplier = 1.1

function startRound() {
    roundEnded = false
    spawningFinished = false
    enemySpawner = setInterval(() => {
        enemies.push(new Enemy(1, 1, 1))
        enemiesSpawned++
        console.log("spawned enemy")
        if (enemiesSpawned >= enemiesToSpawn) {
            clearInterval(enemySpawner)
            spawningFinished = true
            enemiesSpawned = 0
            enemiesToSpawn *= roundMultiplier
            roundMultiplier += 0.1
            if (round % 5 == 0) {
                roundMultiplier += 0.5
            }
            console.log("all enemies spawned")
        }
    }, 1000)
    
}

function checkRoundEnd() {
    if (spawningFinished) {
        if (enemies.length == 0) {
            console.log("round ended")
            roundEnded = true
        }
    }
}

function moveEnemyX(enemy) {
    enemy.xPos++
}

function moveEnemyXBack(enemy) {
    enemy.xPos--
}

function moveEnemyYDown(enemy) {
    enemy.yPos++
}

function moveEnemyYUp(enemy) {
    enemy.yPos--
}

animate()

window.addEventListener("click", (event) => {
    console.log(event.clientX, event.clientY)
    buildSquare1.checkClick(event)
})

window.addEventListener("keypress", (event) => {
    if (event.code = "keyE" && roundEnded) {
        round++
        roundCounterEl.innerHTML = `Round: ${round} `
        startRound()
    }
})