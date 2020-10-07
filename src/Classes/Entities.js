import {DefaultPlayer} from "./Objects";

export class Player extends DefaultPlayer {
    constructor(x, y) {
        super(x, y);
        this.symbol = "P"
        this.inBombSymbol = "₱"
    }
}

export class Enemy extends DefaultPlayer {
    constructor(x, y) {
        super(x, y);
        this.symbol = "M"
        this.inBombSymbol = "ᶆ"

        this.actionsTypes = {
            moveUp: "moveUp",
            moveRight: "moveRight",
            moveDown: "moveDown",
            moveLeft: "moveLeft",
            placeBomb: "placeBomb",
        }

        this.mapActions = [
            {id: 1, action: this.actionsTypes.moveUp},
            {id: 2, action: this.actionsTypes.moveRight},
            {id: 3, action: this.actionsTypes.moveDown},
            {id: 4, action: this.actionsTypes.moveLeft},
            {id: 5, action: this.actionsTypes.placeBomb},
        ]
    }
}

