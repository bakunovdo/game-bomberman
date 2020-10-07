import React from 'react';
import './App.css';

import {Game as Bomberman} from "./Classes/Game";

const config = {
    mapWidth: 15,
    mapHeight: 10,
    enemiesCount: 3,
    moveDelay: 500,
    keymap: {
        moveUp: "KeyW",
        moveRight: "KeyD",
        moveDown: "KeyS",
        moveLeft: "KeyA",
        placeBomb: "Space"
    }
}


const Game = new Bomberman(config)


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {time: Date.now()};
    }

    componentDidMount() {
           this.interval = setInterval(() => this.setState({time: Date.now()}), 50);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <h2>{Game.gameOver ? "Game Over" : "Fight"}</h2>
                <div className="app">
                    <pre>
                        {Game.render()}
                    </pre>
                </div>
            </div>

        )
    }
}

export default App;
