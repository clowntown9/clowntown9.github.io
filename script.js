motd = document.getElementById("motd").firstElementChild;
motdArray = [
    "Good work",
    "Good job",
    "It worked!"
]

function updateMotd() {
    newMsg = motdArray.at(Math.floor(Math.random()*motdArray.length));
    motd.textContent = newMsg;
}

document.addEventListener("DOMContentLoaded", updateMotd);
motd.addEventListener("click", updateMotd);