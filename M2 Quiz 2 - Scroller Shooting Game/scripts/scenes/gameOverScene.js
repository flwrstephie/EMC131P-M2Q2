import game from '../main.js';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.audio('theme', ['./assets/audio/bgm.mp3']);
        this.load.audio('gameOverAudio', ['./assets/audio/sfx/gameOver.mp3']);
    }

    init(data) {
        this.score = data.score;
        this.timeSurvived = data.timeSurvived;
    }

    create() {
        if (!game.music) {
            game.music = this.sound.add('theme');
            game.music.play({ loop: true, volume: 0.3  });
        }

        let gameOverAudio = this.sound.add('gameOverAudio');
        gameOverAudio.play();

        this.cameras.main.setBackgroundColor('#ae7674'); // Set background color to black

        this.add.text(200, 100, 'GAME', {
            fontSize: '90px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);
            
        this.add.text(200, 200, 'OVER', {
            fontSize: '90px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6        
        }).setOrigin(0.5);

        // Display score
        this.add.text(200, 300, 'Score: ' + this.score, { 
            fontSize: '35px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Display time survived
        this.add.text(200, 350, 'Time Survived: ' + this.timeSurvived + 's', { 
            fontSize: '35px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Add buttons
        let restartButton = this.add.text(100, 500, 'RETRY', { 
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene'); 
        });

        let quitButton = this.add.text(300, 500, 'HOME', { 
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene'); 
        });
    }
}

export default GameOverScene;
