const item = {
    el: document.getElementById("rotato"),

    get x() {
        return this.el.getBoundingClientRect().left;
    },
    get y() {
        return this.el.getBoundingClientRect().top;
    },

    angle() {
        document.addEventListener("pointermove", (event) => {
            var posX = this.x;
            var posY = this.y;

            /*var angle = Math.atan2((event.pageY - pageHeight/2), (event.pageX - pageWidth/2));*/
            
            this.el.style.setProperty('--angleY', `${(event.pageX)}deg`);
            this.el.style.setProperty('--angleX', `${(event.pageY)}deg`);
        });
    }
}

item.angle();