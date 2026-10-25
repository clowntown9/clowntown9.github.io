(function(){"use strict";

const motd = document.getElementById("motd").firstElementChild;
const motdArray = [
    "Welcome",
    "Take a seat",
    "Don't look too excited"
]

function updateMotd() {
    const newMsg = motdArray.at(Math.floor(Math.random()*motdArray.length));
    motd.textContent = newMsg;
}

document.addEventListener("DOMContentLoaded", updateMotd);
motd.addEventListener("click", updateMotd);

const clown = document.getElementById("clown")

let rect = 0
let titleGrabbed = false;
let startX = 0;
let startY = 0;
let startscroll = 0;
let deltaScroll = 0;
let x = 0;
let y = 0;

clown.addEventListener("pointerdown", (m) => {
    titleGrabbed = true;
    startX = m.clientX;
    startY = m.clientY;
    startscroll = window.scrollY;
    x = m.clientX - parseFloat(getComputedStyle(clown).getPropertyValue("--clownx")) || 0;
    y = m.clientY - parseFloat(getComputedStyle(clown).getPropertyValue("--clowny")) || 0;
});

document.addEventListener("pointerup", () => {
    titleGrabbed = false;
});
document.addEventListener("pointercancel", () => {
    titleGrabbed = false;
});

document.addEventListener("pointermove", (m) => {
    if (!titleGrabbed) return;
    deltaScroll = window.scrollY - startscroll;
    clown.style.setProperty("--clownx", `${m.clientX-x}px`)
    clown.style.setProperty("--clowny", `${m.clientY+deltaScroll-y}px`)
});

let songPlaying = false;

const funky = document.getElementById("funky")
const funkysong = new Audio("songs/funky boss battle.mp3")
const underground = document.getElementById("underground")
const undergroundsong = new Audio("songs/underground.mp3")
const circus = document.getElementById("circus")
const circussong = new Audio("songs/marginally evil circus.mp3")

const songs = [
    ["funky", "songs/funky boss battle.mp3"]
]

function playSong(songName) {
    if (!songPlaying) {
        songPlaying = true;
        songName.currentTime = 0;
        songName.play();
    } else if (!songName.paused) {
        songPlaying = false;
        songName.pause();
    }
}
function pause(songs) {
    for (const song of songs) {
        songPlaying = false;
        song.pause();
    }
}

funky.addEventListener("click", () => playSong(funkysong));
underground.addEventListener("click", () => playSong(undergroundsong));
circus.addEventListener("click", () => playSong(circussong));

document.getElementById("pause-all").addEventListener("click", () => pause([funkysong, undergroundsong, circussong]));
})();