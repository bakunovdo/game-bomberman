export class PrimitiveObject {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export class DefaultPlayer extends PrimitiveObject {
    constructor(x, y) {
        super(x, y)
        this.moved = false
        this.isAlive = true
    }

    moveUp() {
        if(!this.moved) {
            this.y--
            this.moved = true
        }
    }
    moveRight() {
        if(!this.moved) {
            this.x++
            this.moved = true
        }
    }
    moveDown() {
        if(!this.moved) {
            this.y++
            this.moved = true
        }
    }
    moveLeft() {
        if(!this.moved) {
            this.x--
            this.moved = true
        }
    }

}

export class WhiteSpace extends PrimitiveObject {
    constructor(x, y) {
        super(x, y)
        this.symbol = " "
    }
}

export class Wall extends PrimitiveObject {
    constructor(x, y) {
        super(x, y)
        this.symbol = "■"
    }
}

export class Box extends PrimitiveObject {
    constructor(x, y) {
        super(x, y)
        this.symbol = "□"
    }
}