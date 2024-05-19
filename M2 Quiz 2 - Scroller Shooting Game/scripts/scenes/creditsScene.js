import game from '../main.js';

class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
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

        this.add.text(200, 450, 'Stephanie  Pearl F. Virtudazo', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(200, 500, 'EMC131P - A223', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(200, 550, '2nd Year - BSEMC', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        const backButton = this.add.text(50, 700, 'BACK', {
            fontSize: '25px',
            fontFamily: 'Fatpix',
            fill: '#ffdcd0',
            stroke: '#b74749',
            strokeThickness: 6
        }).setOrigin(0.5);

        backButton.setInteractive().on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

export default CreditsScene;