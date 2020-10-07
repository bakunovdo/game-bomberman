import {PrimitiveObject} from "./Objects";

export class Bomb extends PrimitiveObject {
    constructor(x, y) {
        super(x, y)

        this.symbol = "B"
        this.explSymbol = "F"

        this.mapExploded = []
        this.drawedMap = false

        this.isExploded = false
        this.explosionFinish = false

        this._sizeExplosion = 3
        this._explosion = 3
        this._countdown = 6
    }

    decreaseCountdown() {
        if (!this.isExploded) {
            this._countdown > 0 ? this._countdown-- : this.explode()
        }
    }

    decreaseExplosion() {
        if (!this.explosionFinish && this.isExploded) {
            this._explosion > 0 ? this._explosion-- : this.explosionFinish = true
        }
    }

    createPoint(x, y) {
        return {x, y}
    }



    explode() {
        this.isExploded = true
    }

}