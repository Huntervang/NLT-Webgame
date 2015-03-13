var game = new Phaser.Game(800 , 600, Phaser.AUTO, 'game',{preload: preload, create: create, update: update, render: render});

function preload(){
    game.load.spritesheet('enemies',     'assets/pixel/enemy.png', 128, 128);
    game.load.spritesheet('player',    'assets/flat/Spaceship.png', 64, 64);
    game.load.image('cursor',          'assets/pixel/crosshair.png');
    game.load.image('bullet',          'assets/pixel/bullet.png');
    game.load.spritesheet('explosion', 'assets/pixel/explosion.png', 32, 32);
    game.load.image('openScreen',      'assets/pixel/start_screen.png', 800, 500);
    game.load.image('asteroid',        'assets/pixel/meteorite.png', 64, 64);
    game.load.image('gameOver',        'assets/pixel/game_ over.jpg', 800, 600);
    game.load.image('background',      'assets/flat/background.png');

    game.stage.backgroundColor = '#2c3e50';
}

var player;

var enemies;
var enemy;
var bullets;
var bullet;
var asteroids;
var asteroid;
var edgeAstroids;

var cursor;
var starfield;

var explosion;

var upKey;
var downKey;
var leftKey;
var rightKey;

var acc = 700;
var drag = 200;
var maxVel = 300;

var bulletTime = 0;

var hpEnemy = 10;
var hpPlayer = 9;
var damagePlayer = 2;
var damageEnemy = 1;
var collideDamageEnemy = 5;
var collideDamagePlayer = 1;

var score = 0;

var scoreString = '';
var scoreText;
var healthString = '';
var healthText;

var openScreen;
var gameOver;

var menu = 0;



function create(){
    game.world.setBounds(0,0,1920,1200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    starfield = game.add.tileSprite(0, 0, 1920, 1200, 'background');

    player = game.add.sprite(400, 500, 'player');
   // player.animations.add('fire_p');
   // player.animations.play('fire_p', 10, true);
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(40, 40, 0, 0);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(1, 1);

    game.camera.follow(player);

    bullets = game.add.group(); 
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.enableBody = true;

    for (var i = 0; i<5; i++) {
        enemy = enemies.create(game.rnd.integerInRange(400,1500), game.rnd.integerInRange(400,1200),'enemies');
        enemy.animations.add('fire');
        enemy.animations.play('fire',10,true);
        enemy.body.setSize(60,60,10,-20);
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.setTo(0.01,0.01);
        enemy.anchor.setTo(0.5, 0.5);
    }

    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;
    
    for (var i = 0; i < 4; i++){
        asteroid = asteroids.create(game.rnd.integerInRange(400, 1500), game.rnd.integerInRange(400, 1200), 'asteroid');
        asteroid.body.immovable = true;
        asteroid.body.setSize(40, 40, 10, 10);
    }

    explosion = game.add.group();

    for (var i = 0; i < 10; i++){
        var explosionAnimation = explosion.create(0, 0, 'explosion', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('explosion');
    }

    cursor = game.add.sprite(game.input.mousePointer.worldX, game.input.mousePointer.worldY, 'cursor');
    cursor.anchor.setTo(0.5, 0.5);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' }); 
    scoreText.fixedToCamera = true;
    
    healthString = 'Hull : ';
    healthText = game.add.text(600, 10, healthString + hpPlayer, { font: '34px Arial', fill: '#fff' });
    healthText.fixedToCamera = true;

    openScreen = game.add.sprite(0, 50, 'openScreen');
    openScreen.fixedToCamera = true;
    game.input.onDown.add(removeOpenScreen, this);
}

function removeOpenScreen (){
    game.input.onDown.add(removeOpenScreen, this);
    openScreen.kill();
    window.setTimeout(function(){menu = 1;}, 100);
}

function update(){
    cursor.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    player.body.maxVelocity.setTo(maxVel, maxVel);
    player.body.drag.setTo(drag, drag);

    player.body.acceleration.x = 0;
    player.body.acceleration.y = 0;

    if (menu == 1){
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

        if (game.input.activePointer.isDown && hpPlayer > 0){
            fire();
        }
        player.rotation = game.physics.arcade.angleToPointer(player);
    }

    game.world.wrap(player, 0, true);
    
    game.physics.arcade.collide(player, enemies, playerEnemy);
    game.physics.arcade.collide(player, asteroids, playerAsteroid);

    game.physics.arcade.overlap(bullets, enemies, bulletEnemy);
    game.physics.arcade.overlap(bullets, asteroids, bulletAsteroid);
}

function fire(){
    if (game.time.now > bulletTime){

        bullet = bullets.getFirstExists(false);
        
        if (bullet){
            bullet.reset(player.x, player.y);
            bulletTime = game.time.now + 400;
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000);
        }
    }
}

function playerAsteroid(player, astroid){
    hpPlayer = hpPlayer - collideDamagePlayer;
    healthText.text = healthString + hpPlayer;
}

function playerEnemy(player, enemy){
    hpEnemy = hpEnemy - collideDamageEnemy;
    hpPlayer = hpPlayer -  collideDamagePlayer;
    healthText.text = healthString + hpPlayer;

    killEnemy(enemy);
    killPlayer();
}

function bulletEnemy(bullet, enemy){
    hpEnemy = hpEnemy - damagePlayer;
    
    window.setTimeout(function(){bullet.kill();}, 10);
    killEnemy(enemy);
}

function bulletAsteroid(bullet, asteroid){
    window.setTimeout(function(){bullet.kill();}, 10);
}

function killPlayer(){

    if (hpPlayer < 0){
        player.kill();

        for (var j = 0; j < 25; j += 5){
            var explosionAnimation = explosion.getFirstExists(false);
            explosionAnimation.reset(player.x + game.rnd.integerInRange(-20, 20), player.y + game.rnd.integerInRange(-20, 20));
            explosionAnimation.play('explosion', 40 - game.rnd.integerInRange(0, 30), false, true);
        }

        gameOver = game.add.sprite(0, 0, 'gameOver');
        gameOver.fixedToCamera = true;
    }

}

function killEnemy(enemy){
    if (hpEnemy < 0){
        enemy.kill();

        for (var j = 0; j < 25; j += 5){
            var explosionAnimation = explosion.getFirstExists(false);
            explosionAnimation.reset(enemy.x + game.rnd.integerInRange(-20, 20), enemy.y + game.rnd.integerInRange(-20, 20));
            explosionAnimation.play('explosion', 40 - game.rnd.integerInRange(0, 30), false, true);
        }

        score += 20;
        scoreText.text = scoreString + score;
    }
}

function render(){
    game.debug.body(player);
    bullets.forEachAlive(renderGroup, this);
    asteroids.forEachAlive(renderGroup, this);
    enemies.forEachAlive(renderGroup,this);
}

function renderGroup(member){
    game.debug.body(member);
}

