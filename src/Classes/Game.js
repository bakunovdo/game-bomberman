import {Box, Wall, WhiteSpace} from "./Objects";
import {Bomb} from "./Bomb";
import {Enemy, Player} from "./Entities";
import {getRandom, getRandomRange} from "../utils";

export class Game {
    constructor(options) {
        this.height = options.mapHeight
        this.width = options.mapWidth
        this.keymap = options.keymap
        this.moveDelay = options.moveDelay
        this.enemiesCount = options.enemiesCount

        this.keymapArray = Object.values(this.keymap)

        this.AllEnemies = []
        this.AllBombs = []
        this.moveTimer = null
        this.player = null
        this.gameOver = false

        this.legend = {
            player: "P",
            enemy: "M",
            wall: "■",
            space: " ",
            wrap: "\n",
            bomb: "B",
            box: "□",
            explosion: "F"
        }


        this.blocks = [
            this.legend.wall,
            this.legend.bomb,
            this.legend.box,
            this.legend.enemy
        ]

        const W = this.legend.wall
        const S = this.legend.space
        const B = this.legend.box

        this.classLevelMap = []
        this.symbolsLevelMap = []
        this.levelMap = [
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
            [W, S, S, S, B, S, S, S, S, S, S, S, S, S, W],
            [W, S, S, S, B, S, S, S, S, S, S, S, S, S, W],
            [W, S, S, S, B, S, S, S, S, S, S, B, B, B, W],
            [W, S, S, W, W, W, S, S, S, B, S, S, S, S, W],
            [W, S, S, S, S, B, S, S, S, S, S, S, S, S, W],
            [W, S, S, S, S, S, S, S, S, S, S, S, S, S, W],
            [W, S, S, B, B, S, B, B, B, S, S, B, S, S, W],
            [W, S, S, S, S, S, S, S, S, S, S, W, S, S, W],
            [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W]]


        this.prepare()
        this.init()
    }

    prepare() {
        this.createClassInMap()

        this.spawnPlayer()
        this.spawnAllEnemies()

        this.isWhiteSpace = this.isWhiteSpace.bind(this)
        this.movePlayerHandler = this.movePlayerHandler.bind(this)
    }

    init() {
        document.addEventListener('keydown', this.movePlayerHandler)

        this.moveTimer = setInterval(() => {
            this.player.moved = false
            this.AllBombs.forEach((Bomb) => {
                Bomb.isExploded ? Bomb.decreaseExplosion() : Bomb.decreaseCountdown()
            })

            this.AllEnemies.forEach(Enemy => {
                Enemy.moved = false
                this.createMoveEnemy(Enemy)
            })

        }, this.moveDelay)

    }

    createSpawnPoint() {
        let x, y
        while (true) {
            x = getRandomRange(1, this.width - 1)
            y = getRandomRange(1, this.height - 1)
            if (this.isWhiteSpace(x, y)) break
        }
        return {x, y}
    }

    spawnPlayer() {
        const {x, y} = this.createSpawnPoint()
        this.player = new Player(x, y)
    }

    spawnEnemy() {
        const {x, y} = this.createSpawnPoint()
        this.AllEnemies.push(new Enemy(x, y))
    }

    spawnAllEnemies() {
        for (let i = 0; i < this.enemiesCount; i++) {
            this.spawnEnemy()
        }
    }

    isWhiteSpace(x, y) {
        return this.blocks.indexOf(this.classLevelMap[y][x].symbol) === -1
    }

    safeCheck(x, y) {
        return x > 0 && y > 0 && x < this.width - 1 && y < this.height - 1
    }

    collisionWith(x, y) {
        try {
            return this.levelMap[y][x]
        } catch (e) {
            throw new Error("Check Collision out of the Map")
        }
    }

    changeLevelMap(x, y, symbol) {
        this.levelMap[y][x] = symbol
        this.createClassInMap()
    }

    createMoveEnemy(Enemy) {
        const {mapActions, x ,y} = Enemy
        const rnd = getRandom(Enemy.mapActions.length-1)
        const action = mapActions[rnd].action

        if (action === Enemy.actionsTypes.moveUp && this.isWhiteSpace(x, y - 1)) {
            Enemy.moveUp()
        }

        if (action === Enemy.actionsTypes.moveRight && this.isWhiteSpace(x + 1, y)) {
            Enemy.moveRight()
        }

        if (action === Enemy.actionsTypes.moveDown && this.isWhiteSpace(x, y + 1)) {
            Enemy.moveDown()
        }

        if (action === Enemy.actionsTypes.moveLeft && this.isWhiteSpace(x - 1, y)) {
            Enemy.moveLeft()
        }

        if (action === Enemy.actionsTypes.placeBomb) {
            this.AllBombs.push(new Bomb(x, y))
        }
    }

    movePlayerHandler(event) {
        const {player, keymap, keymapArray, isWhiteSpace} = this
        if (keymapArray.includes(event.code)) {
            const {x, y} = this.player
            if (event.code === keymap.moveUp && isWhiteSpace(x, y - 1)) {
                player.moveUp()
            }

            if (event.code === keymap.moveRight && isWhiteSpace(x + 1, y)) {
                player.moveRight()
            }

            if (event.code === keymap.moveDown && isWhiteSpace(x, y + 1)) {
                player.moveDown()
            }

            if (event.code === keymap.moveLeft && isWhiteSpace(x - 1, y)) {
                player.moveLeft()
            }

            if (event.code === keymap.placeBomb) {
                this.AllBombs.push(new Bomb(x, y))
            }
        }

    }


    deleteFinishedBobs() {
        this.AllBombs = this.AllBombs.filter((Bomb) => {
            if(Bomb.explosionFinish) this.changeLevelMap(Bomb.x, Bomb.y, this.legend.space)
            return !Bomb.explosionFinish
        })
    }

    createClassInMap() {
        const {legend} = this
        this.classLevelMap = this.levelMap.map((row, y) => {
            return row.map((item, x) => {
                switch (item) {
                    case legend.player: {
                        return new Player(x, y)
                    }
                    case legend.wall: {
                        return new Wall(x, y)
                    }
                    case legend.space: {
                        return new WhiteSpace(x, y)
                    }
                    case legend.box: {
                        return new Box(x, y)
                    }
                    case legend.bomb: {
                        return new Bomb(x, y)
                    }
                    default: {
                        throw new Error(`CreateClassInMap don't implement ${item}`)
                    }
                }
            })
        })
    }

    transformLevelToSymbol() {
        const {legend} = this
        this.symbolsLevelMap = this.classLevelMap.map((row) => {
            return row.map((item) => {
                return item.symbol
            })
        })

        this.symbolsLevelMap.forEach(row => row.push(legend.wrap))
    }

    renderGame() {
        this.transformLevelToSymbol()
        this.renderBombs()
        this.renderPlayer()
        this.renderEnemies()
    }


    renderPlayer() {
        const {x, y, symbol, inBombSymbol} = this.player
        if (this.symbolsLevelMap[y][x] === this.legend.bomb) {
            this.symbolsLevelMap[y][x] = inBombSymbol
        } else this.symbolsLevelMap[y][x] = symbol
    }

    renderEnemies() {
        this.AllEnemies = this.AllEnemies.filter((Enemy) => Enemy.isAlive)

        this.AllEnemies.forEach((Enemy) => {
            const {x, y, symbol, inBombSymbol} = Enemy
            if (this.symbolsLevelMap[y][x] === this.legend.bomb) {
                this.symbolsLevelMap[y][x] = inBombSymbol
            } else this.symbolsLevelMap[y][x] = symbol
        })
    }


    renderBombs() {
        this.deleteFinishedBobs()
        this.AllBombs.forEach((Bomb) => {
            const {x, y, symbol, explSymbol} = Bomb
            this.changeLevelMap(x,y, symbol)
            if (Bomb.isExploded) {
                if (!Bomb.drawedMap) this.drawMapExplosion(Bomb)

                Bomb.mapExploded.forEach((exp => {
                    this.symbolsLevelMap[exp.y][exp.x] = explSymbol

                    if (exp.x === this.player.x && exp.y === this.player.y) {
                        this.gameOver = true
                        this.player.isAlive = false
                    }

                    this.AllEnemies.forEach(Enemy => {
                        if (exp.x === Enemy.x && exp.y === Enemy.y) {
                            Enemy.isAlive = false
                        }
                    })
                }))
            }
            this.symbolsLevelMap[y][x] = symbol
        })

    }

    drawMapExplosion(Bomb) {
        const {x, y, _sizeExplosion, createPoint} = Bomb

        let matchEntityAtUp = false
        let matchEntityAtRight = false
        let matchEntityAtDown = false
        let matchEntityAtLeft = false

        for (let i = 1; i <= _sizeExplosion; i++) {
            [
                {dx: 0, dy: 1, stopExplosion: matchEntityAtUp, dir: "Up"},
                {dx: 1, dy: 0, stopExplosion: matchEntityAtRight, dir: "Right"},
                {dx: 0, dy: -1, stopExplosion: matchEntityAtDown, dir: "Down"},
                {dx: -1, dy: 0, stopExplosion: matchEntityAtLeft, dir: "Left"}
            ].forEach(({dx, dy, stopExplosion, dir}) => {
                const eX = x + dx * i
                const eY = y + dy * i

                if (this.safeCheck(eX, eY)) {
                    const Entity = this.collisionWith(eX, eY)

                    const isWhiteSpace = Entity === this.legend.space
                    const isBox = Entity === this.legend.box

                    if (!isWhiteSpace && !stopExplosion) {
                        if (dir === "Up") matchEntityAtUp = true
                        if (dir === "Right") matchEntityAtRight = true
                        if (dir === "Down") matchEntityAtDown = true
                        if (dir === "Left") matchEntityAtLeft = true
                    }

                    if (isBox && !stopExplosion) {
                        this.changeLevelMap(eX, eY, this.legend.space)
                    }

                    if (this.isWhiteSpace(eX, eY) && !stopExplosion) {
                        Bomb.mapExploded.push(createPoint(eX, eY))
                    }
                }
            })
        }

        Bomb.drawedMap = true
    }


    render() {
        this.renderGame()

        const map = this.symbolsLevelMap.map(row => row.join('')).join('')
        return `${map}`
    }

    destroy() {
        clearInterval(this.moveTimer)
        document.removeEventListener('keydown', this.movePlayerHandler)
    }

}