var game = new Phaser.Game('100%' , '100%', Phaser.AUTO, 'game',{preload: preload, create: create, update: update, render: render});


function preload(){
    game.load.spritesheet('enemy', 'assets/Enemy.png', 128, 128);
    game.load.spritesheet('player', 'assets/Player.png', 64, 64);
    game.load.image('background', 'assets/Background.png');
    game.load.image('cursor', 'assets/cross_0.png');
    game.load.image('bullet', 'assets/bullet_good_0.png');
    game.stage.backgroundColor = '#2e628e';
    game.load.spritesheet('explosion', 'assets/Explosion.png', 32, 32);
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
var score = 0;
var HPenemy = 10;
var HPplayer = 11;
var damagePlayer = 1;
var damageEnemy = 1;
var collideDamageEnemy = 1;
var collideDamagePlayer = 1;
var explosion;

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

    explosion = game.add.group();

    for (var i = 0; i < 10; i++)
    {
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
}

function update(){
    player.rotation = game.physics.arcade.angleToPointer(player);

    cursor.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    player.body.maxVelocity.setTo(maxVel, maxVel);
    player.body.drag.setTo(drag, drag);

    player.body.acceleration.x = 0;
    player.body.acceleration.y = 0;

    enemy.body.maxVelocity.setTo(maxVel, maxVel);
    enemy.body.drag.setTo(drag, drag);

    enemy.body.acceleration.x = 0;
    enemy.body.acceleration.y = 0;

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
    
    if (game.input.activePointer.isDown){
        fire();
    }

    game.world.wrap(player, 0, true);
    
    if (game.physics.arcade.collide(player, enemy)){
        HPenemy = HPenemy - collideDamageEnemy;
        HPplayer = HPplayer -  collideDamagePlayer;
    };
    if (game.physics.arcade.overlap(bullets, enemy, bulletHit)){
       HPenemy = HPenemy - damagePlayer;
    };
    
    var t = game.add.text(0, 0, "Score: " + score,{ font: "24px Arial", fill: "#f1c40f", align : "center"});
    t.fixedToCamera = true;
    t.cameraOffset.setTo(10, 10);

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

function bulletHit(bullets, bullet){
    bullet.kill();

    if (HPenemy <= 0){
        enemy.kill();
        score += 100

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
