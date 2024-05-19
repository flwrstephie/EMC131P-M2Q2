import CreditsScene from './scenes/creditsScene.js';
import GameOverScene from './scenes/gameOverScene.js';
import GameScene from './scenes/gameScene.js';
import MainMenuScene from './scenes/mainMenuScene.js';


let bgm;

let config = {
    type: Phaser.AUTO,
    width: 400,
    height: 725,
    scene: [MainMenuScene, CreditsScene, GameScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Initializes the Game
let game = new Phaser.Game(config);
game.bgm = bgm;

export default game;
