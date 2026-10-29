const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 5;

ctx.beginPath();
ctx.moveTo(0,75);
ctx.lineTo(250, 75);