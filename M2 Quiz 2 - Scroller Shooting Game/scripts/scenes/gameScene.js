import game from '../main.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('background', './assets/sprites/background.png'); 
        this.load.spritesheet('miko', './assets/sprites/miko.png', { frameWidth: 80, frameHeight: 80 });
        this.load.image('projectile', './assets/sprites/orb.png');
        this.load.spritesheet('obstacle', './assets/sprites/cicin.png', { frameWidth: 30, frameHeight: 20 });
        this.load.image('enemyProjectile', './assets/sprites/cicinOrb.png');
        this.load.image('heart', './assets/sprites/heart.png');

        this.load.audio('theme', ['./assets/audio/bgm.mp3']);
        this.load.audio('playerProjectile', ['./assets/audio/sfx/playerProjectile.wav']);
        this.load.audio('playerHit', ['./assets/audio/sfx/playerHit.wav']);
        this.load.audio('enemyHit', ['./assets/audio/sfx/enemyHit.wav']);
        this.load.audio('enemyProjectile', ['./assets/audio/sfx/enemyProjectile.wav']);

    }

    create() {
        
        this.background = this.add.tileSprite(0, 0, 400, 725, 'background').setOrigin(0, 0);
        this.player = this.physics.add.sprite(200, 680, 'miko').setCollideWorldBounds(true).setDepth(1);

        if (!game.music) {
            game.music = this.sound.add('theme');
            game.music.play({ loop: true, volume: 0.3  });
        }

        this.sfx = {
            playerProjectile: this.sound.add('playerProjectile'),
            playerHit: this.sound.add('playerHit'),
            enemyHit: this.sound.add('enemyHit'),
            enemyProjectile: this.sound.add('enemyProjectile')
        };

        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('miko', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'obstacleMove',
            frames: this.anims.generateFrameNumbers('obstacle', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.projectiles = this.physics.add.group({
            defaultKey: 'projectile',
            maxSize: 10
        });
        this.obstacles = this.physics.add.group({
            defaultKey: 'obstacle',
            runChildUpdate: true
        });
        this.enemyProjectiles = this.physics.add.group({
            defaultKey: 'enemyProjectile',
            runChildUpdate: true
        });

        this.spawnRate = 2000;

        this.spawnTimer = this.time.addEvent({
            delay: this.spawnRate,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.physics.add.collider(this.projectiles, this.obstacles, this.hitObstacle, null, this);
        this.physics.add.collider(this.player, this.obstacles, this.hitObstaclePlayer, null, this);
        this.physics.add.collider(this.player, this.enemyProjectiles, this.hitEnemyProjectilePlayer, null, this);

        this.score = 0;
        this.scoreText = this.add.text(250, 16, 'Score: 0', { fontFamily: 'FatPix', fontSize: '25PX', fill: '#fff' }).setDepth(2);
        this.timeSurvived = 0;
        this.timeText = this.add.text(250, 50, 'Time: 0', { fontFamily: 'FatPix', fontSize: '25px', fill: '#fff' }).setDepth(2);

        this.health = 5;
        this.maxHealth = 5;
        this.hearts = this.add.group({
            key: 'heart',
            repeat: this.maxHealth - 1,
            setXY: { x: 25, y: 35, stepX: 32 }
        });

        this.hearts.children.iterate((heart) => {
            heart.setDepth(2);
            heart.setScale(1.5);
        });

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeSurvived += 1;
                this.timeText.setText('Time: ' + this.timeSurvived + 's');
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.background.tilePositionY -= 2; 

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        this.player.anims.play('walk', true);

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shootProjectile();
        }

        this.projectiles.children.iterate(function (projectile) {
            if (projectile && projectile.y < 0) {
                projectile.destroy();
            }
        });

        this.obstacles.children.iterate(function (obstacle) {
            if (obstacle && obstacle.y > 725) {
                obstacle.destroy();
            }
        }, this);

        this.enemyProjectiles.children.iterate(function (projectile) {
            if (projectile && projectile.y > 725) {
                projectile.destroy();
            }
        });

        this.adjustSpawnRate();
    }

    shootProjectile() {
        let projectile = this.projectiles.get(this.player.x, this.player.y + 40, 'projectile');
        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setVelocityY(-300);
            projectile.setDepth(0);
            this.sfx.playerProjectile.play(); 
        }
    }
    
    spawnObstacle() {
        let obstacle = this.obstacles.get(Phaser.Math.Between(50, 350), -100, 'obstacle');
        if (obstacle) {
            obstacle.setActive(true);
            obstacle.setVisible(true);
            obstacle.setScale(2);
            obstacle.play('obstacleMove');

            let baseVelocity = 200;
            let additionalVelocity = Math.floor(this.score / 150) * 50;
            obstacle.setVelocityY(baseVelocity + additionalVelocity);

            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    if (obstacle.active) {
                        this.shootEnemyProjectile(obstacle.x, obstacle.y);
                    }
                },
                callbackScope: this,
                loop: true
            });
        }
    }

    shootEnemyProjectile(x, y) {
        let projectile = this.enemyProjectiles.get(x, y, 'enemyProjectile');
        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setScale(2);
            projectile.setVelocityY(300);
            this.sfx.enemyProjectile.play();

            this.time.addEvent({
                delay: 12000,
                callback: () => {
                    if (projectile.active) {
                        this.shootEnemyProjectile(projectile.x, projectile.y);
                    }
                },
                callbackScope: this,
                loop: true
            });
        }
    }

    hitObstacle(projectile, obstacle) {
        if (projectile) projectile.destroy();
        if (obstacle) {
            obstacle.destroy();
            this.sfx.enemyHit.play(); 
        }
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitObstaclePlayer(player, obstacle) {
        if (obstacle) {
            obstacle.destroy();
        }
        this.sfx.playerHit.play();
        this.decreaseHealth();
    }

    hitEnemyProjectilePlayer(player, projectile) {
        if (projectile) {
            projectile.destroy();
        }
        this.sfx.playerHit.play();
        this.decreaseHealth();
    }

    decreaseHealth() {
        this.health--;
        this.hearts.children.entries[this.health].setVisible(false);

        if (this.health <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.scene.stop('GameScene');
        this.scene.start('GameOverScene', { score: this.score, timeSurvived: this.timeSurvived });
    }

    adjustSpawnRate() {
        let newSpawnRate = 3000 - Math.floor(this.score / 100) * 500;

        if (newSpawnRate < 500) newSpawnRate = 500;  
    
        if (this.spawnTimer.delay !== newSpawnRate) {
            this.spawnTimer.remove(false);
            this.spawnTimer = this.time.addEvent({
                delay: newSpawnRate,
                callback: this.spawnObstacle,
                callbackScope: this,
                loop: true
            });
        }
    }
    
}

export default GameScene;
