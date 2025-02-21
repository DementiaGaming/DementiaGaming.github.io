document.addEventListener('DOMContentLoaded', function () {
    let username = localStorage.getItem("username");
    if (!username) {
        username = `Guest${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem("username", username)
    }
    console.log(username);
    document.getElementById("welcome").innerHTML = `Welcome ${username}`
});

function adjustTitleSize() {
    const title = document.getElementById('welcome');
    const windowWidth = window.innerWidth;

    if (windowWidth < 600) {
        title.style.fontSize = '20px';
    } else if (windowWidth < 1000) {
        title.style.fontSize = '30px';
    } else {
        title.style.fontSize = '40px';
    }
}

window.addEventListener('resize', adjustTitleSize);
window.onload = adjustTitleSize;
