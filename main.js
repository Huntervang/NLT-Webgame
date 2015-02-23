var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv',{preload: preload, create: create, update: update});


function preload(){
    game.load.spritesheet('ene', 'assets/Enemy.png', 128, 128);
    game.stage.backgroundColor = '#2e628e';
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.enemy = this.game.add.sprite(300, 200, 'ene');

    this.enemy.animations.add('fire');
    this.enemy.animations.play('fire', 10, true);
}

function update(){

}

