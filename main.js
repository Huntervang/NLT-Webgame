// create the game variable
var game = new Phaser.Game(800 , 600, Phaser.AUTO, 'game',{preload: preload, create: create, update: update, render: render});

// load the webfont
WebFontConfig = {
    active: function() { 
        game.time.events.add(Phaser.Timer.SECOND, createText, this); 
    },
    
    google: {
      families: ['Lato']
    }

};

// Preload loads everything before the game starts
function preload(){
    
    // load the images and spritesheets 
    game.load.spritesheet('enemies',   'assets/flat/enemyspritesheet64.png', 64, 64);
    game.load.spritesheet('player',    'assets/flat/spaceshipspritesheet.png', 128, 128);
    game.load.image('bullet',          'assets/pixel/bullet.png');
    game.load.spritesheet('explosion', 'assets/pixel/explosion.png', 32, 32);
    game.load.image('openScreen',      'assets/flat/startscreen.png', 800, 500);
    game.load.image('asteroid',        'assets/flat/asteriode64.png', 64, 64);
    game.load.image('gameOver',        'assets/flat/game_over.png', 800, 600);
    game.load.image('background',      'assets/flat/background.png');
    game.load.image('planet',          'assets/flat/Planet200.png', 128, 128);
    game.load.image('moon',            'assets/flat/Moon64.png');
    game.load.image('b_hp',            'assets/pixel/b_health.png', 40, 40);
    game.load.image('m_hp',            'assets/pixel/m_health.png', 40, 40);
    game.load.image('e_hp',            'assets/pixel/e_health.png', 40, 40);
    game.load.audio('music',           'assets/music.mp3');

    // set the background color
    game.stage.backgroundColor = '#2c3e50';

    // load the script used for the webfont
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    
    // set the time to advanced to be able to show the FPS
    game.time.advancedTiming = true;
}

// set the global variables
var player;

var enemies;
var enemy;
var bullets;
var bullet;
var asteroids;
var asteroid;
var planets;
var planet; 

var cursor;
var starfield;

var explosion;

var upKey;
var downKey;
var leftKey;
var rightKey;
var xKey;
var keys;

var acc = 700;
var drag = 100;
var maxVel = 300;

var bulletTime = 0;

var hpEnemy = 5;
var hpPlayer = 9;
var damagePlayer = 1;
var damageEnemy = 1;
var collideDamageEnemy = 2.5;
var collideDamagePlayer = 1;

var score = 0;

var scoreString = '';
var scoreText;

var hp;
var maxHp = 5;

var openScreen;
var gameOver;

var menu = 0;

var music;

var enemyBullet;
var livingEnemies = [];
var firingTimerEnemy = 0;

var numberOfEnemies = 10;

// create runs all its code once after the game has loaded
function create(){
    
    // set the size of the world
    game.world.setBounds(0,0,4000,2000);

    // start the physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // create the background
    starfield = game.add.tileSprite(0, 0, 4000 , 2000, 'background');

    music = game.sound.play('music');

    // create the planet group and set their properties
    planets = game.add.group();
    planets.enableBody = true;
    planets.physicsBodyType = Phaser.Physics.ARCADE;

    // spawn the planets in the world
    for (var i = 0; i<3; i++) {
        if (i = 1){
            planet = planets.create(game.rnd.integerInRange(200,1800), game.rnd.integerInRange(200,800),'planet');
            planet.zIndex = 100;
        }
        if (i = 2){
            planet = planets.create(game.rnd.integerInRange(2200, 3800), game.rnd.integerInRange(200,800),'planet');
            planet.zIndex = 100;
        }
        if (i = 3){
            planet = planets.create(game.rnd.integerInRange(200,1800), game.rnd.integerInRange(1200,1800),'planet');
            planet.zIndex = 100;
        }
        if (i = 4){
            planet = planets.create(game.rnd.integerInRange(2200,3800), game.rnd.integerInRange(1200, 1800),'planet');
            planet.zIndex = 100;
        }
    }

    // create the player and set its properties
    player = game.add.sprite(400, 500, 'player');
    player.animations.add('fire_p');
    player.animations.play('fire_p', 10, true);
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.setSize(64, 64, 0, 0);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(1, 1);
    player.scale.setTo(0.5, 0.5);

    // make the camera follow the player
    game.camera.follow(player);

    // create the bullet group and set their properties
    bullets = game.add.group(); 
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    
    // create the enemy's bullet group and set their properties
    enemyBullets = game.add.group(); 
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    // create the enemies group and set their properties
    enemies = game.add.group();
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.enableBody = true;

    // spawn the enemies in the world
    for (var i = 0; i<numberOfEnemies; i++) {
        enemy = enemies.create(game.rnd.integerInRange(600,3800), game.rnd.integerInRange(600,1800),'enemies');
        enemy.animations.add('fire');
        enemy.animations.play('fire',10,true);
        enemy.body.setSize(60,60,0,0);
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.setTo(0.01,0.01);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.health = hpEnemy;
    }

    // create the asteroids group and set their properties
    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;
    
    // spawn the asteroids in the world
    for (var i = 0; i < 20; i++){
        asteroid = asteroids.create(game.rnd.integerInRange(400, 3800), game.rnd.integerInRange(400, 1800), 'asteroid');
        asteroid.body.immovable = true;
        asteroid.body.setSize(40, 40, 10, 10);
    }

    explosion = game.add.group();

    for (var i = 0; i < 10; i++){
        var explosionAnimation = explosion.create(0, 0, 'explosion', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('explosion');
    }

    //cursor = game.add.sprite(game.input.mousePointer.worldX, game.input.mousePointer.worldY, 'cursor');
    //cursor.anchor.setTo(0.5, 0.5);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    keys = game.input.keyboard.createCursorKeys();

    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Lato', fill: '#fff' });
    scoreText.fixedToCamera = true;
    
    /*healthString = 'Hull : ';
    healthText = game.add.text(690, 10, healthString + hpPlayer, { font: '34px Lato', fill: '#fff' });
    healthText.fixedToCamera = true;
    healthText.addColor('#27ae60',7);*/

    hp = game.add.group();

    setHp();

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
    //cursor.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    player.body.maxVelocity.setTo(maxVel, maxVel);
    player.body.drag.setTo(drag, drag);
    
    enemy.body.maxVelocity.setTo(maxVel, maxVel);
    enemy.body.drag.setTo(drag, drag);

    //player.body.acceleration.x = 0;
    //player.body.acceleration.y = 0;

    if (menu == 1){
       /*if(leftKey.isDown){
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
        */

        if (xKey.isDown && hpPlayer > 0){
            fire();
        }

        if (keys.up.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation, 500, player.body.acceleration);
        }
        else {
            player.body.acceleration.set(0);
        }

        if (keys.left.isDown) {
            player.body.angularVelocity = -250;
        }
        else if (keys.right.isDown) {
            player.body.angularVelocity = 250;
        }
        else {
            player.body.angularVelocity = 0;
        }
    }
    
    game.world.wrap(player, 0, true);
    
    game.physics.arcade.collide(player, enemies, playerEnemy);
    game.physics.arcade.collide(player, asteroids, playerAsteroid);
    game.physics.arcade.collide(enemies, asteroids, enemyAsteroid);

    game.physics.arcade.overlap(bullets, enemies, bulletEnemy);
    game.physics.arcade.overlap(enemyBullets, player, bulletPlayer);
    game.physics.arcade.overlap(bullets, asteroids, bulletAsteroid);
    
    if (menu === 1){
        aI(enemy);
    
        enemyFires ()
    }
}

function aI(enemy) {
    for(var i = 0; i < enemies.length; i++) {
        if (game.physics.arcade.distanceBetween(player, enemies.children[i]) < 400){
            game.physics.arcade.moveToObject(enemies.children[i], player)
            enemies.children[i].rotation = game.physics.arcade.angleToXY(enemies.children[i], player.x, player.y) + 1.57079632679;
        }
    }
}

function enemyFires () {
    enemyBullet = enemyBullets.getFirstDead();
    
    livingEnemies.length = 0;
    
    enemies.forEachAlive(
        function(enemies){
            livingEnemies.push(enemies);
        }
    );

    if (enemyBullet && livingEnemies.length > 0){
        
        for(var i = 0; i < enemies.length; i++) {
            if (game.physics.arcade.distanceBetween(player, enemies.children[i]) < 400 && firingTimerEnemy < game.time.now ){
        
                var shooter = livingEnemies[i];
                
                if (typeof shooter != 'undefined'){
                    enemyBullet.reset(shooter.body.x + 30, shooter.body.y + 30);
                }
                
                game.physics.arcade.moveToObject(enemyBullet,player,400);
                enemyBullet.rotation = game.physics.arcade.angleToXY(enemyBullet, player.x, player.y);
                firingTimerEnemy = game.time.now + 500;
                
                if (i = enemies.length){
                    i = 0;
                }
            }
        }
    }
}



function setHp(){
    if (typeof b_hp !== 'undefined'){
        b_hp.kill();
        e_hp.kill();
        hp.removeAll();
    }

    for (var i = 0; i < maxHp; i++) {
        if (i == (maxHp - 1) && maxHp !== 1){
            b_hp = game.add.sprite(750 - (45 *  i), 30, 'b_hp');
            b_hp.anchor.setTo(0.5, 0.5);
            b_hp.fixedToCamera = true;
        } else if (i == 0 && maxHp !== 1){
            e_hp = game.add.sprite(750 - (45 *  i), 30, 'e_hp');
            e_hp.anchor.setTo(0.5, 0.5);
            e_hp.fixedToCamera = true;
        } else{
            m_hp = hp.create(750 - (45 *  i), 30, 'm_hp');
            m_hp.anchor.setTo(0.5, 0.5);
            m_hp.fixedToCamera = true;
        }
    }
}

function fire(){
    if (game.time.now > bulletTime){

        bullet = bullets.getFirstExists(false);
        
        if (bullet){
            bullet.reset(player.x, player.y);
            bulletTime = game.time.now + 200;
            bullet.rotation = player.rotation;
            game.physics.arcade.accelerationFromRotation(player.rotation, 1000, bullet.body.velocity);
            //game.physics.arcade.moveToPointer(bullet, 1000);
        }
    }
}

function playerAsteroid(player, asteroid, a){
    killPlayer(collideDamagePlayer);
}

function enemyAsteroid(enemy, asteroid){
    enemy.damage(damagePlayer);
    killEnemy(enemy);
}

function playerEnemy(player, enemy){
    enemy.damage(collideDamageEnemy);

    killEnemy(enemy);
    killPlayer(collideDamagePlayer);
}

function bulletEnemy(bullet, enemy){
    enemy.damage(damagePlayer);
    killEnemy(enemy);

    window.setTimeout(function(){bullet.kill();}, 10);
}

function bulletPlayer(player, enemyBullet){
    killPlayer(damageEnemy);

    window.setTimeout(function(){enemyBullet.kill();}, 10);
}

function bulletAsteroid(bullet, asteroid){
    window.setTimeout(function(){bullet.kill();}, 10);
}

function killPlayer(a){
    
    maxHp -= a;
    setHp();
    
    if (maxHp <= 0){
        player.kill();

        gameOver = game.add.sprite(0, 0, 'gameOver');
        gameOver.fixedToCamera = true;
        
        menu = 0
        
        explode(player);
    }

    
}

function killEnemy(enemy){
    if (enemy.health <= 0) {
        explode(enemy);

        score += 20;
        scoreText.text = scoreString + score;
    }
}

function explode(sprite){
    for (var j = 0; j < 25; j += 5){
            var explosionAnimation = explosion.getFirstExists(false);
            explosionAnimation.reset(sprite.x + game.rnd.integerInRange(-20, 20), sprite.y + game.rnd.integerInRange(-20, 20));
            explosionAnimation.play('explosion', 40 - game.rnd.integerInRange(0, 30), false, true);
    }
}

function render(){
    //game.debug.body(player);
    //bullets.forEachAlive(renderGroup, this);
    //asteroids.forEachAlive(renderGroup, this);
    //enemies.forEachAlive(renderGroup,this);
    //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}

function renderGroup(member){
    game.debug.body(member);
}
