const canvas = document.getElementById("canvas");
const c = canvas.getContext('2d');

const livesEl = document.getElementById("lives")
const roundCounterEl = document.getElementById("roundCounter")
const moneyEl = document.getElementById("money")
const roundPromptEl = document.getElementById("roundPrompt")
const upgradeSpeedT1El = document.getElementById("upgradeSpeedT1")
const upgradeDamageT1El = document.getElementById("upgradeDamageT1")
const upgradeAccuracyT1El = document.getElementById("upgradeAccuracyT1")

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
        c.fillStyle = "white"
        c.fillText(`${this.health}`, this.xPos + 25, this.yPos + 25)
        c.fillStyle = "black"
    }

    checkHit() {
        projectiles.forEach((projectile, index) => {
            if (this.xPos < projectile.x && this.xPos + 50 > projectile.x) {
                if (this.yPos < projectile.y && this.yPos + 50> projectile.y) {
                    this.health -= projectile.damage
                    money += 5
                    projectiles.splice(index, 1)
                    if (this.health <= 0) {
                        enemies.splice(enemies.indexOf(this), 1)
                        money += 10
                    }
                }
            }
        })
    }
}

class BuildSquares {
    constructor(x, y, cost, damage) {
        this.xPos = x
        this.yPos = y
        this.width = 55
        this.height = 50
        this.buildStatus = "green"
        this.cost = cost // not built
        this.cooldownTime = 1000 // ms
        this.cooldown = false
        this.damage = damage
        this.accuracy = 1
    }

    draw() {
        c.fillStyle = this.buildStatus
        c.fillRect(this.xPos,this.yPos,this.width,this.height);
        c.fillStyle = "black"
        if (this.buildStatus == "green") {
            c.fillText("$100", 327, 225)
        } else {
            c.fillText("1", 327, 225)
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
                if (enemy.xPos < 500 && enemy.xPos > 100) {
                    this.attack()
                }
            })
        }
    }

    attack() {
        if (!this.cooldown && enemies.length > 0) {
            let target = enemies.at(0)
            console.log(target)
            console.log(target.xPos, target.yPos)
            const angle = Math.atan2((target.yPos + 25) - this.yPos, (target.xPos + 25) - this.xPos)
            const speed = {
                x: Math.cos(angle) * this.accuracy,
                y: Math.sin(angle) * this.accuracy
            }
            projectiles.push(new Projectile(this.xPos + 30, this.yPos + 10, 10, speed, this.damage))
            console.log(angle)
            this.cooldown = true
            this.decreaseCooldown()
        }
    }

    decreaseCooldown() {
        setTimeout(() => {
            this.cooldown = false
        }, this.cooldownTime)
    }
}

class Projectile {
    constructor(x, y, radius, speed, damage) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = "red"
        this.speed = speed
        this.damage = damage
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
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
let enemyHealthMax = 1
let maxRoundsWithoutDifficultyIncrease = 5
let roundsWithoutDifficultyIncrease = 0

let money = 100 
let lives = 100

let speedUpgradeCostT1 = 200
let damageUpgradeCostT1 = 200
let accuracyUpgradeCostT1 = 200

let buildSquare1 = new BuildSquares(300, 200, 100, 1)

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "grey"
    c.fillRect(0,0,canvas.width, canvas.height)
    c.fillStyle = "black"
    c.drawImage(image, 0, 0);
    moneyEl.innerHTML = `Money: $${money} `
    enemies.forEach(enemy => {
        enemy.draw()
        enemy.checkHit()
    });
    projectiles.forEach((projectile) => {
        projectile.update()
    })
    buildSquare1.draw()
    buildSquare1.checkEnemiesInRange()
    //console.log(enemies.length)
    //console.log(projectiles)

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
    roundPromptEl.style.visibility = "hidden"
    roundEnded = false
    spawningFinished = false
    let nextEnemyHealth = 0
    enemySpawner = setInterval(() => {
        console.log(`enemy health max before: ${enemyHealthMax}`)
        nextEnemyHealth = Math.floor(Math.random() * enemyHealthMax) + 1
        console.log(`enemy health max after: ${enemyHealthMax}`)
        console.log(`next enemy health: ${nextEnemyHealth}`)
        enemies.push(new Enemy(nextEnemyHealth, 1, 1))
        nextEnemyHealth = 0
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
        if (enemies.length == 0 && roundEnded == false) {
            //console.log("round ended")
            roundEnded = true
            roundPromptEl.style.visibility = "visible"
            money += 100 + round * 10
            moneyEl.innerHTML = `Money: $${money} `
            if (roundsWithoutDifficultyIncrease >= maxRoundsWithoutDifficultyIncrease) {
                enemyHealthMax++
                roundsWithoutDifficultyIncrease = 0
            } else {
                roundsWithoutDifficultyIncrease++
                let rng = Math.floor(Math.random() * 6) + 1
                if (rng == 1) {
                    enemyHealthMax++
                    roundsWithoutDifficultyIncrease = 0
                } else if (rng == 2) {
                    enemyHealthMax += 2
                    roundsWithoutDifficultyIncrease = 0
                } else if (rng == 3) {
                    enemyHealthMax += 3
                    roundsWithoutDifficultyIncrease = 0
                }
            }    
            console.log(roundsWithoutDifficultyIncrease)
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

function updateDescription(text) {
    document.getElementById("descriptionBox").innerText = text;
}

function resetDescription() {
    document.getElementById("descriptionBox").innerText = "Hover over a button to see details!";
}

upgradeSpeedT1El.addEventListener("click", () => {
    if (money >= speedUpgradeCostT1 && buildSquare1.cooldownTime > 100) {
        money -= speedUpgradeCostT1
        speedUpgradeCostT1 += 200
        buildSquare1.cooldownTime -= 100
        if (buildSquare1.cooldownTime < 100) {
            upgradeSpeedT1El.innerHTML = "Max Level"
        }
        upgradeSpeedT1El.innerHTML = `$${speedUpgradeCostT1}`
    }
})

upgradeDamageT1El.addEventListener("click", () => {
    if (money >= damageUpgradeCostT1) {
        money -= damageUpgradeCostT1
        damageUpgradeCostT1 += 250
        buildSquare1.damage++
        upgradeDamageT1El.innerHTML = `$${damageUpgradeCostT1}`
    }
})

upgradeAccuracyT1El.addEventListener("click", () => {
    if (money >= accuracyUpgradeCostT1 && buildSquare1.accuracy < 5) {
        money -= accuracyUpgradeCostT1
        accuracyUpgradeCostT1 += 300
        buildSquare1.accuracy += 1
        if (buildSquare1.accuracy == 5) {
            upgradeAccuracyT1El.innerHTML = "Max Level"
        }
        upgradeAccuracyT1El.innerHTML = `$${accuracyUpgradeCostT1}`
    }
})