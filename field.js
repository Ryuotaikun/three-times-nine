class Field {
    constructor(value, x, y, htmlButton) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.object = htmlButton;
        this.active = true;
        this.selected = false;
    }

    toggleSelection() {
        this.selected = !this.selected;
        if (this.selected) this.object.classList.add("selected")
        else this.object.classList.remove("selected")
        console.log(`${this.x},${this.y} selection toggled to ${this.selected}`)
    }

    crossOut() {
        this.active = false;
        this.object.classList.add("inactive")
        console.log(`Crossed out ${this.x},${this.y}`)
    }
}