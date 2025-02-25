const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

const scoreEl = document.getElementById("scoreEl")
const startGameButton = document.getElementById("startGameButton")
const modalEl = document.getElementById("modalEl")
const leaderboardEl = document.getElementById("leaderboardContainer")
const bigScoreEl = document.getElementById("bigScoreEl")
const timeEl = document.getElementById("timeEl")
const levelEl = document.getElementById("levelEl")
const xpBar = document.getElementById("xpBar");
const powerupBarsContainer = document.getElementById("powerup-bars-container");

let username = localStorage.getItem("username");

canvas.width = innerWidth
canvas.height = innerHeight

let mobileDevice

class Player {
    constructor(x, y, radius, colour, damage){
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.damage = damage
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
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
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
        this.dashMode = false //if true enemy dashes at the player
        this.dashSpeedMultiplier = 3
        this.powerup = false
        this.hue = 0
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0,Math.PI * 2, false)
        if (!this.powerup) {
            c.fillStyle = this.colour
        } else {
            c.fillStyle = `hsl(${this.hue}, 100%, 50%)`
        }
        c.fill()
    }

    update() {
        if (!this.dashMode) {
            this.draw()
            this.x = this.x + this.speed.x
            this.y = this.y + this.speed.y
            if ((Math.floor((Math.random() * dashModeFrequency + 1)) == 1) && !this.powerup) {
                this.dashMode = true
            }
        } else {
            this.draw()
            this.x = this.x + this.speed.x * this.dashSpeedMultiplier
            this.y = this.y + this.speed.y * this.dashSpeedMultiplier
        }
        if ((Math.floor((Math.random() * dashModeFrequency + 1)) == 1) && !this.powerup && !this.dashMode) {
            this.powerup = true
        }
        if (this.powerup) {
            this.hue = (this.hue + 10) % 360
        }
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
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
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

let player = new Player(x, y, 10, "white", 10) 
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

let damageIncreaseInterval = 0

let projectileRadius = 5

let dashModeFrequency = 10000

function addXP(amount) {
    if (doubleXpActive) {
        xp += amount * 2;
    } else {
        xp += amount;
    }
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

let maxXpIncreaseRequirement = 100
function levelUp() {
    level++;
    levelEl.textContent = level;
    maxXP += maxXpIncreaseRequirement; // xp requirement increases
    xp = 0;
    gsap.to(player, {
        radius: player.radius + 5
    })
    if (damageIncreaseInterval >= 10) {
        player.damage += 1;
        projectileRadius += 1;
        damageIncreaseInterval = 0;
        maxXpIncreaseRequirement *= 2
    } else {
        damageIncreaseInterval++;
    }
}

let firstHit = false;

function init() {
    player = new Player(x, y, 10, "white", 10) 
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
    maxXpIncreaseRequirement = 100
    updateXPBar();
    levelEl.textContent = level;
    damage = 10
    damageIncreaseInterval = 0
    projectileRadius = 5
    firstHit = false
    dashModeFrequency = 10000
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

function increaseSpawnSpeed() {
    if(spawnSpeed > 500) {
        spawnSpeed -= 100
        dashModeFrequency -= 1000
        nextDifficulttyIncrease += 10000
    } else if (spawnSpeed > 100) {
        spawnSpeed -= 50
        dashModeFrequency -= 500
        nextDifficulttyIncrease += 15000
    }   
    clearInterval(setIntervalID)
    clearInterval(difficultyIntervalID)
    setIntervals()
}

let enemiesToBarrage = 0

function spawnEnemy() {
    if ((Math.floor(Math.random() * 100) + 1) === 5 && enemiesToBarrage <= 0) {
        console.log("enemy barage")
        showWarning("Enemy Barrage Incomming")
        setTimeout(() => {
            enemiesToBarrage = Math.floor(Math.random() * 20) + 1
            if (enemiesToBarrage < 10) {
                enemiesToBarrage = 10
            }
        }, 5000)
    }

    let radius
    if (level <= 10) {
        radius = Math.random() * (30 - 5) + 5 
    }
    else if (level <= 20) {
        radius = Math.random() * (40 - 5) + 5
    }
    else if (level <= 25) {
        radius = Math.random() * (50 - 5) + 5
    }
    else if (level <= 30) {
        radius = Math.random() * (60 - 5) + 5
    }
    else if (level <= 35) {
        radius = Math.random() * (70 - 5) + 5
    }
    else {
        radius = Math.random() * (80 - 5) + 5
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

    
    const hue = Math.random() * 300 + 30;
    const colour = `hsl(${hue}, 50%, 50%)`
    
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const speed = {x:Math.cos(angle) , y: Math.sin(angle)}
    
    enemies.push(new Enemy(x,y,radius,colour,speed))

    if (enemiesToBarrage >= 1) {
        enemiesToBarrage -= 1
        spawnEnemy()
    }
}

function playerDie() {
    cancelAnimationFrame(animationID)
    modalEl.style.display = "flex"
    leaderboardEl.style.display = "block"
    leaderboardEl.offsetHeight;
    bigScoreEl.innerHTML = score
    clearInterval(setIntervalID)
    clearInterval(difficultyIntervalID)
    clearInterval(timerIntervalID)
    clearInterval(bonusScoreID)
    submitScore(username, score)
    removeAllPowerupBars()
}

function addScore(amount) {
    score += amount * scoreMultiplier
    scoreEl.innerHTML = score
}

function showWarning(message, duration = 5000) { // Default warning lasts 5 sec
    const overlay = document.getElementById("warning-overlay");
    const text = document.getElementById("warning-text");

    text.textContent = message;
    overlay.style.display = "block";

    // 🔥 Flash effect with longer duration
    gsap.to(overlay, { 
        opacity: 0.3, 
        duration: 0.5,   // ⏳ Each flash lasts longer
        repeat: 12,       // 🔄 Number of flashes
        yoyo: true       // ↔️ Makes it fade in and out
    });

    // Show text with fade effect
    gsap.to(text, { opacity: 1, duration: 0.5 });

    // Hide everything after the duration
    setTimeout(() => {
        gsap.to(overlay, { opacity: 0, duration: 1, onComplete: () => overlay.style.display = "none" });
        gsap.to(text, { opacity: 0, duration: 0.5 });
    }, duration);
}

const powerupTimeouts = {}; // Store timeouts
const powerupAnimations = {}; // Store GSAP animations

function createPowerupBar(powerupName, duration, color) {
    const powerupBarsContainer = document.getElementById("powerup-bars-container");

    // Create bar
    const bar = document.createElement("div");
    bar.classList.add("powerup-bar");

    // Create inner bar
    const barInner = document.createElement("div");
    barInner.classList.add("powerup-bar-inner");
    barInner.style.backgroundColor = color;

    // Create text
    const barText = document.createElement("span");
    barText.classList.add("powerup-bar-text");
    barText.textContent = powerupName;

    // Append elements
    bar.appendChild(barInner);
    bar.appendChild(barText);
    powerupBarsContainer.appendChild(bar);

    // Resize bars equally
    resizeBars();

    // Start animation
    startPowerupTimer(powerupName, barInner, duration);
}

function startPowerupTimer(powerupName, barInner, duration) {
    // Clear any existing animation or timeout
    if (powerupAnimations[powerupName]) {
        powerupAnimations[powerupName].kill();
    }
    if (powerupTimeouts[powerupName]) {
        clearTimeout(powerupTimeouts[powerupName]);
    }

    // Reset bar to full
    barInner.style.width = "100%";

    // Create new GSAP animation
    powerupAnimations[powerupName] = gsap.to(barInner, {
        width: "0%",
        duration: duration,
        ease: "linear",
        onComplete: () => {
            barInner.parentElement.remove();
            resizeBars();
            delete powerupTimeouts[powerupName];
            delete powerupAnimations[powerupName];
        },
    });

    // Set timeout for cleanup
    powerupTimeouts[powerupName] = setTimeout(() => {
        barInner.parentElement.remove();
        resizeBars();
        delete powerupTimeouts[powerupName];
        delete powerupAnimations[powerupName];
    }, duration * 1000);
}

// Function to resize all bars equally
function resizeBars() {
    const powerupBarsContainer = document.getElementById("powerup-bars-container");
    const bars = powerupBarsContainer.children;
    const barCount = bars.length;
    
    if (barCount === 0) return;

    const newWidth = Math.max(80, 100 / barCount) + "%"; // Distribute width evenly

    // Animate all bars to equal width
    gsap.to(".powerup-bar", {
        width: newWidth,
        duration: 0.3,
        ease: "ease-in-out",
    });
}

function removePowerupBar(powerupName) {
    const bars = document.querySelectorAll(".powerup-bar");

    bars.forEach((bar) => {
        if (bar.querySelector(".powerup-bar-text").textContent === powerupName) {
            bar.remove();
            resizeBars();
        }
    });
}

function removeAllPowerupBars() {
    const powerupBarsContainer = document.getElementById("powerup-bars-container");

    // Remove all bars from the container
    while (powerupBarsContainer.firstChild) {
        powerupBarsContainer.firstChild.remove();
    }

    // Resize bars (which will now be empty)
    resizeBars();
}

function resetPowerupBar(powerupName, duration, colour) {
    const bars = document.querySelectorAll(".powerup-bar");

    bars.forEach((bar) => {
        if (bar.querySelector(".powerup-bar-text").textContent === powerupName) {
            bar.remove();
            resizeBars();
        }
    });

    createPowerupBar(powerupName, duration, colour)
}

let nukeActive = false

function giveRandomPowerup() {
    const randomPowerup = Math.floor(Math.random() * 7) + 1;

    if (randomPowerup === 1) {
        activateNuke()
    } else if (randomPowerup === 2) {
        activateShield()
    } else if (randomPowerup === 3) {
        activateDoublePoints()
    } else if (randomPowerup === 4) {
        activateDoubleXp()
    } else if (randomPowerup === 5) {
        activateSizeUp()
    } else if (randomPowerup === 6) {
        activateLevelUpPower()
    } else if (randomPowerup === 7) {
        activateGatlingPower()
    }
}

let gatlingActive = false
function activateGatlingPower() {
    showPowerupPopup("Gatling Attack")
    let timeout

    if (!gatlingActive) {
        createPowerupBar("Gatling Attack", 10, "red")
        gatlingActive = true
        timeout = setTimeout(() => {
            gatlingActive = false
        }, 10000)
    } else {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            gatlingActive = false
        }, 10000)
        resetPowerupBar("Gatling Attack", 10, "red")
    }
}

function activateLevelUpPower() {
    showPowerupPopup("Level Up")
    levelUp()
}

function activateSizeUp() {
    showPowerupPopup("Size Up")
    gsap.to(player, {
        radius: player.radius + 20
    })
}

let doubleXpActive = false

function activateDoubleXp() {
    showPowerupPopup("Double XP")
    let timeout
    if (!doubleXpActive) {
        createPowerupBar("Double XP", 10, "green")
        doubleXpActive = true
        timeout = setTimeout(() => {
            doubleXpActive = false
        }, 10000)
    } else {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            doubleXpActive = false
        }, 10000)
        resetPowerupBar("Double XP", 10, "green")
    }
}

let doublePointsMultiplier = 1

function activateDoublePoints() {
    showPowerupPopup("Double Points");
    let timeout

    if (doublePointsMultiplier === 1) {
        doublePointsMultiplier = 2;
        createPowerupBar("Double Points", 10, "yellow");

        timeout = setTimeout(() => {
            doublePointsMultiplier = 1;
        }, 10000);
    } else {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            doublePointsMultiplier = 1;
        }, 10000);
        resetPowerupBar("Double Points", 10, "yellow")
    }
}

let shieldActive = false;
let shieldOpacity = 0.5;

function activateShield() {
    showPowerupPopup("Shield");
    let timeout

    if (!shieldActive) {
        createPowerupBar("Shield", 10, "cyan");
        shieldActive = true;
        timeout = setTimeout(() => {
            shieldActive = false;
        }, 10000);
    } else {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            shieldActive = false;
        }, 10000);
        resetPowerupBar("Shield", 10, "cyan")
    }
}

function drawShield() {
    let shieldRadius = player.radius + 30;
    if (shieldActive) {
        c.beginPath();
        c.arc(player.x, player.y, shieldRadius, 0, Math.PI * 2, false);
        c.fillStyle = `rgba(0, 255, 255, ${shieldOpacity})`; // Transparent cyan color
        c.fill();
    }
}

function activateNuke() {
    showPowerupPopup("Nuke");

    const overlay = document.getElementById("screenOverlay");

    // Fade to full white (completely covers everything)
    gsap.to(overlay, {
        duration: 1,
        opacity: 1, // Fully visible white screen
        onComplete: () => {
            // Remove all enemies efficiently
            for (let i = enemies.length - 1; i >= 0; i--) {
                enemies.splice(i, 1)
                addXP(20)
            }
            addXP(100);
            addScore(10000)

            // Hold white screen for a brief moment before fading out
            setTimeout(() => {
                gsap.to(overlay, {
                    duration: 0.5,
                    opacity: 0, // Fade back to invisible
                });
            }, 500); // Hold for 0.5 seconds before fading out
        }
    });
}




let animationID
let score = 0
function animate() {
    animationID = requestAnimationFrame(animate)
    
    checkAchievements()

    c.fillStyle = "rgba(0, 0, 0, 0.1)"
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.draw()

    drawShield()

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
        
    })

    projectiles.forEach((projectile, index) => {
        projectile.update()

        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update()
        if (enemy.dashMode) {
            gsap.to(enemy, {
                colour: "red"
            })
        }
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (distance - enemy.radius - player.radius < 1) {
            if (player.radius > 10) {
                if (shieldActive) {
                    shieldActive = false
                    removePowerupBar("Shield")
                    enemies.splice(index, 1)
                } else {
                    enemies.splice(index, 1)
                    gsap.to(player, {
                        radius: player.radius - 10
                    })
                    firstHit = true
                }
            } 
            else {
                playerDie()
            }
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

                if (enemy.radius - player.damage > 5) {
                    score += Math.floor((100 * scoreMultiplier)) * doublePointsMultiplier
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - player.damage
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                    addXP(10)
                }
                else{
                    setTimeout(() => {
                        score += (Math.floor((250 * scoreMultiplier))) * doublePointsMultiplier
                        scoreEl.innerHTML = score
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                        addXP(20)
                        if (enemy.powerup) {
                            giveRandomPowerup()
                        }
                    }, 0)
                }
            }
        })
    }) 
}

function addBonusScore() {
    switch (seconds) {
        case 10:
            score += 100 * doublePointsMultiplier
            scoreMultiplier = 1.1
            addXP(50)
            break;
        case 20:
            score += 250 * doublePointsMultiplier
            scoreMultiplier = 1.2
            addXP(100)
            break;
        case 30:
            score += 500 * doublePointsMultiplier
            scoreMultiplier = 1.3
            addXP(150)
            break;
        case 45:
            score += 750 * doublePointsMultiplier
            scoreMultiplier = 1.4
            addXP(200)
            break;
        case 60:
            score += 1000 * doublePointsMultiplier
            scoreMultiplier = 2.0
            addXP(250)
            break;
        case 75:
            score += 1500 * doublePointsMultiplier
            scoreMultiplier = 2.5
            addXP(300)
            break;
        case 90:
            score += 2000 * doublePointsMultiplier
            scoreMultiplier = 3.0
            addXP(400)
            break;
        case 105:
            score += 2500 * doublePointsMultiplier
            scoreMultiplier = 4.0
            addXP(500)
            break;
        case 120:
            score += 5000 * doublePointsMultiplier
            scoreMultiplier = 5.0
            addXP(600)
            break;
        case 200:
            score += 10000 * doublePointsMultiplier
            scoreMultiplier = 10.0
            addXP(1000)
            break;
    }
}

function showPowerupPopup(powerupName) {
    const popup = document.getElementById('powerup-popup');
    const text = document.getElementById('powerup-text');
    text.textContent = `Power-Up: ${powerupName}`;
    popup.classList.remove('hidden');
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hidden');
    }, 2000);
}

/*
addEventListener("keypress", () => {
    giveRandomPowerup()
})
*/

document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    //console.log(`Mouse Position: X=${mouseX}, Y=${mouseY}`);

    if (gatlingActive) {
        const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
        const speed = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        projectiles.push(new Projectile(x, y, projectileRadius, "white", speed))
    }
});

addEventListener("click", (event) => {
    if (!mobileDevice) {
        const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
        const speed = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        projectiles.push(new Projectile(x, y, projectileRadius, "white", speed))
        //console.log(angle)
    }
})

addEventListener("touchend", (event) => {
    const angle = Math.atan2(event.changedTouches[0].clientY - canvas.height / 2, event.changedTouches[0].clientX - canvas.width / 2);
    const speed = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    };
    projectiles.push(new Projectile(x, y, projectileRadius, "white", speed));
});

startGameButton.addEventListener("click", () => {
    init()
    animate()
    modalEl.style.display = "none"
    leaderboardEl.style.display = "none"
})

function checkAchievements() {
    if (level >= 10) {
        unlockAchievement("Orb Novice");
    }
    if (level >= 20) {
        unlockAchievement("Orb Apprentice");
    }
    if (level >= 30) {
        unlockAchievement("Orb Master");
    }
    if (level >= 40) {
        unlockAchievement("Orb Grandmaster");
    }
    if (level >= 50) {
        unlockAchievement("Orb Legend");
    }
    if (seconds >= 60 && !firstHit) {
        unlockAchievement("Can't Touch This");
    }
    if (score >= 250000) {
        unlockAchievement("Master of the Orbs");
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

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    mobileDevice = true
    console.log("Mobile device detected")
} else {
    mobileDevice = false
    console.log("Mobile device not detected")
}

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD05szBZ5VCfZn_qQUd3kJd_CeaiaiwMLk",
    authDomain: "orb-defender-leaderboard.firebaseapp.com",
    projectId: "orb-defender-leaderboard",
    storageBucket: "orb-defender-leaderboard.firebasestorage.app",
    messagingSenderId: "391417318379",
    appId: "1:391417318379:web:6d7e5b21dd9a3dbd73a7ae",
    measurementId: "G-45ECVLT6HE"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Test Firebase Connection
console.log("✅ Firebase initialized successfully!");

function submitScore(playerName, playerScore) {
    const leaderboardRef = db.collection("leaderboard").doc(playerName); // Use player's name as the document ID

    db.runTransaction(async (transaction) => {
        const doc = await transaction.get(leaderboardRef);

        if (!doc.exists) {
            // New player, create their entry
            transaction.set(leaderboardRef, { name: playerName, score: playerScore });
        } else {
            // Player exists, update their score ONLY IF it's higher
            const existingScore = doc.data().score;
            if (playerScore > existingScore) {
                transaction.update(leaderboardRef, { score: playerScore });
            }
        }
    }).then(() => {
        console.log("Score submitted successfully!");
        fetchLeaderboard(); // Refresh leaderboard UI
    }).catch((error) => {
        console.error("Error submitting score: ", error);
    });
}

function fetchLeaderboard() {
    const db = firebase.firestore();

    db.collection("leaderboard")
        .orderBy("score", "desc")  // Sort by highest score
        .limit(100)  // Show top 100 players
        .get()
        .then(snapshot => {
            const leaderboardList = document.getElementById("leaderboard");
            leaderboardList.innerHTML = ""; // Clear previous leaderboard

            let rank = 1; // Start ranking from 1
            snapshot.forEach(doc => {
                const data = doc.data();
                const playerName = data.name || "Unknown";  // Ensure name exists
                const playerScore = data.score || 0;  // Ensure score exists

                const listItem = document.createElement("li");
                listItem.className = "flex justify-between py-1 border-b border-gray-700";
                listItem.innerHTML = `
                    <span class="font-semibold">${rank}. ${playerName}</span> 
                    <span>${playerScore}</span>
                `;
                leaderboardList.appendChild(listItem);
                rank++; // Increment rank
            });
        })
        .catch(error => {
            console.error("Error fetching leaderboard: ", error);
        });
}

window.onload = fetchLeaderboard;
