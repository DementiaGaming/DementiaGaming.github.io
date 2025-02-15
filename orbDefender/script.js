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

let username = localStorage.getItem("username");

canvas.width = innerWidth
canvas.height = innerHeight

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
    gsap.to(player, {
        radius: player.radius + 5
    })
    if (damageIncreaseInterval >= 4) {
        player.damage += 2;
        projectileRadius += 2;
        damageIncreaseInterval = 0;
    } else {
        damageIncreaseInterval++;
    }
}

// testing(delete later)
//document.addEventListener("click", () => addXP(10));
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
    updateXPBar();
    levelEl.textContent = level;
    damage = 10
    damageIncreaseInterval = 0
    projectileRadius = 5
    firstHit = false
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
    if(spawnSpeed > 300) {
        spawnSpeed -= 100
        nextDifficulttyIncrease += 5000
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

    
    const colour = `hsl(${Math.random() * 360}, 50%, 50%)`
    
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const speed = {x:Math.cos(angle) , y: Math.sin(angle)}
    
    enemies.push(new Enemy(x,y,radius,colour,speed))
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
}

let animationID
let score = 0
function animate() {
    animationID = requestAnimationFrame(animate)
    
    checkAchievements()

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
            if (player.radius > 10) {
                enemies.splice(index, 1)
                gsap.to(player, {
                    radius: player.radius - 10
                })
                firstHit = true
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
                    score += Math.floor((100 * scoreMultiplier))
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
        case 200:
            score += 10000
            scoreMultiplier = 10.0
            addXP(1000)
            break;
    }
}

addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const speed = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(x, y, projectileRadius, "white", speed))
    console.log(angle)
})

addEventListener("touchend", (event) => {
    const angle = Math.atan2(event.changedTouches[0].clientY - canvas.height / 2, event.changedTouches[0].clientX - canvas.width / 2)
    const speed = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(x, y, projectileRadius, "white", speed))
    console.log(angle)
})

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
        .limit(100)  // Show top 10 players
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