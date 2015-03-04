var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',{preload: preload, create: create, update: update});


function preload(){
    game.load.spritesheet('enemy', 'assets/Enemy.png', 128, 128);
    game.load.spritesheet('player', 'assets/Player.png', 64, 64);
    game.load.image('background', 'assets/Background.png');
    game.load.spritesheet('explosion', 'assets/Explosion.png', 32, 32);
    game.load.image('cursor', 'assets/cross_0.png');
    game.load.image("bullet", 'assets/bullet_good_0.png');
    game.stage.backgroundColor = '#2e628e';
}

var player;
var enemy;
var bullet; 
var cursor;
var starfield;
var explosion;
var upKey;
var downKey;
var leftKey;
var rightKey;
var acc = 1000;
var drag = 400;
var maxVel = 300;

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    starfield = game.add.tileSprite(0, 0, 800, 600, 'background');

    explosion = game.add.sprite(100, 500, 'explosion');
    explosion.animations.add('explosion');
    explosion.animations.play('explosion', 10, true);

    player = game.add.sprite(400, 500, 'player');
    player.animations.add('fire_p');
    player.animations.play('fire_p', 10, true);
    player.anchor.setTo(0.5,0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    enemy = game.add.sprite(300, 200, 'enemy');
    enemy.animations.add('fire');
    enemy.animations.play('fire', 10, true);

    cursor = game.add.sprite(game.input.mousePointer.worldX, game.input.mousePointer.worldY, 'cursor');
    cursor.anchor.setTo(0.5, 0.5);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update(){
    player.rotation = game.physics.arcade.angleToPointer(player);

    cursor.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    player.body.maxVelocity.setTo(maxVel, maxVel);
    player.body.drag.setTo(drag, drag);

    player.body.acceleration.x = 0;
    player.body.acceleration.y = 0;

    if(leftKey.isDown){
    	player.body.acceleration.x = -acc;
    }

    if(rightKey.isDown){
    	player.body.acceleration.x = acc;
    }

    if (downKey.isDown){
    	player.body.acceleration.y = acc;
    }

    if (upKey.isDown){
    	player.body.acceleration.y = -acc;
    }
}
