var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv',{preload: preload, create: create, update: update});


function preload(){
    game.load.spritesheet('enemy', 'assets/Enemy.png', 128, 128);
    game.load.spritesheet('player', 'assets/Player.png', 64, 64);
    game.load.image('background', 'assets/Background.png');
    game.load.spritesheet('explosion', 'assets/Explosion.png', 32, 32);

    game.stage.backgroundColor = '#2e628e';
}

var player;
var enemy;
var starfield;
var explosion;

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

    enemy = game.add.sprite(300, 200, 'enemy');
    enemy.animations.add('fire');
    enemy.animations.play('fire', 10, true);
}

function update(){
    player.rotation = game.physics.arcade.angleToPointer(player);
}
