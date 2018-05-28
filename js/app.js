// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 10;
    this.y = 45;
    this.speed = 125;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    if (this.x > 520) {
        this.x = -60;
        // AR - value of this.x here chosen so it appears enemy bugs come in from off-screen
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
    // AR - x and y starting coordinates, places player at bottom centre of grid.
    this.speed = 1;
};

// Update the players's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.y < -15 ) {
        //AR - this y coordinate corresponds to the top row of the play grid
       // AR - value of this.y here chosen to reset player to beginning when player reaches water zone (goal), we set a 500ms timeout before resetting so player can see themselves enter the water area before they teleport back to the start
       if (playerStart === 1) {
        setTimeout(this.reachGoal, 500);
        playerStart = 0;
       }
       // AR - wrapping the timeout inside an if block here prevents the inner reachGoal function from being called multiple times in a row while the player position has yet to be reset
       // AR - the function here must be a reference, without () else will be executed instantly
    }
    
    this.checkCollision();
};


// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
    if (keyPress === 'up' && this.y > -15) {
        this.y -= 85;
    }
    if (keyPress === 'down'&& this.y < 400) {
        this.y += 85;
    }
    if (keyPress === 'left' && this.x > 10) {
        this.x -= 100;
    }
    if (keyPress === 'right' && this.x < 400) {
        this.x += 100;
    }
    // AR - the AND '&&' conditionals prevent the player from moving off the grid
};


// Now instantiate your objects.
let enemy1 = new Enemy();
let enemy2 = new Enemy();
enemy2.x = 100;
enemy2.y = 130;
enemy2.speed = 90;
let enemy3 = new Enemy();
enemy3.x = 300;
enemy3.y = 215;
enemy3.speed = 110;
// Place all enemy objects in an array called allEnemies
let allEnemies = [enemy1, enemy2, enemy3];
// Place the player object in a variable called player
let player = new Player();
let playerStart = 1;
let goalScore = 0;
let bugScore = 0;
let textUpdate = 1;
let goalMessage = document.querySelector('.goal-message');
let collisionMessage = document.querySelector('.collision-message');

Player.prototype.resetMainPlayer = function () {
    this.x = 200;
    this.y = 400;
    textUpdate = 1;
    playerStart = 1
}

Player.prototype.checkCollision = function () {
    allEnemies.forEach(function(enemy) {
        if (Math.abs(player.y - enemy.y) < 20) {
            if (Math.abs(player.x - enemy.x) < 60) {
                player.bugCollision();
            }
        }
        // AR - collision detection here, with a vertical/horizontal range of collision so a rectangular 'hit box' is formed around each enemy bug
    });
}

Player.prototype.reachGoal = function () {
    // AR - wrapping the text update inside an if block here prevents the inner code from being called multiple times in a row while the player position has yet to be reset
    if (textUpdate === 1) {
        textUpdate = 0;
        goalScore++;
        goalMessage.textContent=`Achieved happiness ${goalScore} time(s)!`;
    }
    player.resetMainPlayer();
}

Player.prototype.bugCollision = function () {
    // AR - wrapping the text update inside an if block here prevents the inner code from being called multiple times in a row while the player position has yet to be reset
    if (textUpdate === 1) {
        textUpdate = 0;
        bugScore++;
        collisionMessage.textContent=`The bugs got you ${bugScore} time(s)!`;
    }
    
    player.resetMainPlayer();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
