console.log('Health Check')

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
//Establish Game
var game = new Phaser.Game(config);


function preload ()
{
  //Preloads images used in game

    this.load.image('sky', '/public/assets/sky.png');
    this.load.image('ground', '/public/assets/platform.png');
    this.load.image('star', '/public/assets/star.png');
    this.load.image('bomb', '/public/assets/bomb.png');
    this.load.spritesheet('dude', 
        '/public/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

var platforms;
var player;
var score = 0;
var scoreText;
var instructionsText;


function create ()
{
  //Creates Platforms
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  //Creates the player
  player = this.physics.add.sprite(100, 450, 'dude');
  this.physics.add.collider(player,platforms)

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //Creates sprite animation
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //Create stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms)
  this.physics.add.overlap(player, stars, collectStar, null, this)

  //Create scoreboard
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

  //Create Bombs
  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);

  //display instructions
  instructionsText = this.add.text(16, 50, "Press 'Left Arrow' to go Left", {fontSize: '16px', fill: '#000' }),
                     this.add.text(16, 70, "Press 'Right Arrow' to go Right", {fontSize: '16px', fill: '#000' }),
                     this.add.text(16, 90, "Press 'Spacebar' to Jump", {fontSize: '16px', fill: '#000' })

}



function update ()
{
  //Creates Movement
  cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown){
    player.setVelocityX(-160);

    player.anims.play('left', true);
}
else if (cursors.right.isDown){
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else{
    player.setVelocityX(0);

    player.anims.play('turn');
}

if (cursors.space.isDown && player.body.touching.down){
    player.setVelocityY(-310);
}

}

function collectStar (player, star)
{
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0)
  {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

// var restartGame;  

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    this.add.text(220, 260, 'GAMEOVER', { fontSize: '72px', fill: '#000' });
    // restartGame = this.add.text(250, 325, 'RESTART',{ fontSize: '55px', fill: '#000' });
   

}






