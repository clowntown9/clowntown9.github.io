const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 5;
let x = 200

function main() {
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 0);
    ctx.lineTo(300, 100);
    ctx.lineTo(200, x);
    ctx.fill();
    x++;


    requestAnimationFrame(main)
    main()
};

main()