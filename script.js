motd = document.getElementById("motd").firstElementChild;
motdArray = [
    "Welcome",
    "Take a seat",
    "Don't look too excited"
]

function updateMotd() {
    newMsg = motdArray.at(Math.floor(Math.random()*motdArray.length));
    motd.textContent = newMsg;
}

document.addEventListener("DOMContentLoaded", updateMotd);
motd.addEventListener("click", updateMotd);