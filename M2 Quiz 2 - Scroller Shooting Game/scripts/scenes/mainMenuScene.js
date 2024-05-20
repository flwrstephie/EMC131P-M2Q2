import game from '../main.js';

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('logo', './assets/sprites/miko_logo.png');
        this.load.audio('theme', ['./assets/audio/bgm.mp3']);
    }

    create() {
        if (!game.music) {
            game.music = this.sound.add('theme');
            game.music.play({ loop: true, volume: 0.5 });
        }

        this.cameras.main.setBackgroundColor('#ae7674');

        const logo = this.add.image(200, 100, 'logo').setScale(0.3).setOrigin(0.5);

        this.add.text(200, 200, 'KITSUNE GUUJI', {
            fontSize: '40px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);
            
        this.add.text(200, 250, 'SAVE ME !', {
            fontSize: '40px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6        
        }).setOrigin(0.5);

        const playButton = this.add.text(200, 450, 'PLAY', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        const creditsButton = this.add.text(200, 500, 'CREDITS', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        const quitButton = this.add.text(200, 550, 'QUIT', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        playButton.setInteractive()
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            })
            .on('pointerover', () => {
                playButton.setScale(1.1); 
            })
            .on('pointerout', () => {
                playButton.setScale(1); 
            });

        creditsButton.setInteractive()
            .on('pointerdown', () => {
                this.scene.start('CreditsScene');
            })
            .on('pointerover', () => {
                creditsButton.setScale(1.1); 
            })
            .on('pointerout', () => {
                creditsButton.setScale(1); 
            });

        quitButton.setInteractive()
            .on('pointerdown', () => {
                
                alert('Exiting the game.');
            })
            .on('pointerover', () => {
                quitButton.setScale(1.1); 
            })
            .on('pointerout', () => {
                quitButton.setScale(1); 
            });
    }
}

export default MainMenuScene;
