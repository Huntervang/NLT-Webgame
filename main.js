var game = new Phaser.Game(800 , 600, Phaser.AUTO, 'game',{preload: preload, create: create, update: update, render: render});

function preload(){
    game.load.spritesheet('enemy',     'assets/pixel/enemy.png', 128, 128);
    game.load.spritesheet('player',    'assets/pixel/player.png', 64, 64);
    game.load.image('cursor',          'assets/pixel/crosshair.png');
    game.load.image('bullet',          'assets/pixel/bullet.png');
    game.load.spritesheet('explosion', 'assets/pixel/explosion.png', 32, 32);
    game.load.image('openScreen',      'assets/pixel/start_screen.png', 800, 500);
    game.load.image('astroid',         'assets/pixel/meteorite.png', 64, 64);

    game.load.image('background',      'assets/flat/background.png');

    game.stage.backgroundColor = '#2e628e';
}

var player;
var enemy;
var bullets;
var bullet;
var cursor;
var starfield;
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
var damagePlayer = 1;
var damageEnemy = 1;
var collideDamageEnemy = 1;
var collideDamagePlayer = 1;
var explosion;
var score = 0;
var scoreString = '';
var scoreText;
var openScreen;
var healthString = '';
var healthText;
var menu = 0;
var atroids;

function create(){
    game.world.setBounds(0,0,1920,1200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    starfield = game.add.tileSprite(0, 0, 1920, 1200, 'background');

    player = game.add.sprite(400, 500, 'player');
    player.animations.add('fire_p');
    player.animations.play('fire_p', 10, true);
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(40, 40, 0, 0);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(2, 2);

    game.camera.follow(player);

    bullets = game.add.group(); 
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    enemy = game.add.sprite(300, 200, 'enemy');
    enemy.animations.add('fire');
    enemy.animations.play('fire', 10, true);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.setSize(40, 40, 53, 20);
    enemy.body.collideWorldBounds = true;
    enemy.body.bounce.setTo(0.01, 0.01);

    astroids = game.add.group();
    astroids.enableBody = true;
    astroids.physicsBodyType = Phaser.Physics.ARCADE;
    
    for (var i = 0; i < 4; i++){
        astroids.create(game.rnd.integerInRange(400, 1500), game.rnd.integerInRange(400, 1200), 'astroid');
        astroids.children[i].body.immovable = true;
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
    window.setTimeout(setMenu, 100);
}

function setMenu(){
    menu = 1;
}

function update(){
    cursor.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    player.body.maxVelocity.setTo(maxVel, maxVel);
    player.body.drag.setTo(drag, drag);

    player.body.acceleration.x = 0;
    player.body.acceleration.y = 0;

    enemy.body.maxVelocity.setTo(maxVel, maxVel);
    enemy.body.drag.setTo(drag, drag);

    enemy.body.acceleration.x = 0;
    enemy.body.acceleration.y = 0;

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
    
    game.physics.arcade.collide(player, enemy, playerHit);
    game.physics.arcade.overlap(bullets, enemy, bulletHit);
    game.physics.arcade.collide(player, astroids, astroidHit);
    game.physics.arcade.overlap(astroids, bullets, bulletHitAstroid);
}

function fire(){
    if (game.time.now > bulletTime){

        bullet = bullets.getFirstExists(false);
        
        if (bullet){
            bullet.reset(player.x, player.y);
            bulletTime = game.time.now + 100;
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000);
        }
    }
}

function astroidHit(player, astroids){
    hpPlayer = hpPlayer - collideDamagePlayer;
    healthText.text = healthString + hpPlayer;
    kill(hpPlayer, player);
}

function playerHit(player, enemy){
    hpEnemy = hpEnemy - collideDamageEnemy;
    hpPlayer = hpPlayer -  collideDamagePlayer;
    healthText.text = healthString + hpPlayer;
    
    kill(hpPlayer, player);
    kill(hpEnemy, enemy);
}

function bulletHit(bullets, bullet){
    bullet.kill();
    
    hpEnemy = hpEnemy - damagePlayer;
    
    kill(hpPlayer, player);
    kill(hpEnemy, enemy);
}

function bulletHitAstroid(bullets, bullet){
    bullet.kill();
}

function kill(a,b){
    if (a <= 0){
        b.kill();

        if (b == enemy){
            score += 20;
            scoreText.text = scoreString + score;
        }

        for (var j = 0; j < 25; j += 5){
            var explosionAnimation = explosion.getFirstExists(false);
            explosionAnimation.reset(enemy.x + game.rnd.integerInRange(40, 100), enemy.y + game.rnd.integerInRange(40, 100));
            explosionAnimation.play('explosion', 40 - game.rnd.integerInRange(0, 30), false, true);
        }
        
    }
}

function render(){
    //game.debug.body(player);
    //game.debug.body(enemy);
    //game.debug.body(bullets);
}
