import GameEnv from './GameEnv.js';
import Player from './Player.js';

/**
 * The GameControl object manages the game.
 * 
 * This object uses the Object Literal coding style, which is a way to group related functions and properties together.
 * 
 * @type {Object}
 * @property {Player} player - The player object.
 * @property {function} start - Initialize game assets and start the game loop.
 * @property {function} gameLoop - The game loop.
 * @property {function} resize - Resize the canvas and player object when the window is resized.
 */
const GameControl = {
    player: null, // Define the player object.

    start: function() {
        GameEnv.start(); // Must be 1st as it sets the canvas, ie Game World.
        this.player = new Player();
        this.gameLoop();
    },

    gameLoop: function() {
        GameEnv.clear(); // Clear the canvas, removes trails before new drawing.
        this.player.update();
        requestAnimationFrame(this.gameLoop.bind(this));
    },

    resize: function() {
        GameEnv.resize(); // Adapts the canvas to the new window size, ie a new Game World.
        this.player.resize();
    }
};

// Detect window resize events and call the resize function.
window.addEventListener('resize', GameControl.resize.bind(GameControl));

export default GameControl;