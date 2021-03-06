/*
* Enemy class
*/

// Enemies our player must avoid
let Enemy = function() {
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

/*
* Player class
*/

let Player = function() {
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
            this.reachGoal();
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

Player.prototype.resetMainPlayer = function () {
    this.x = 200;
    this.y = 400;
}

Player.prototype.checkCollision = function () {
    for (let i = 0; i < allEnemies.length; i++) {
        if (Math.abs(this.y - allEnemies[i].y) < 20) {
            if (Math.abs(this.x - allEnemies[i].x) < 60) {
                this.bugCollision();
            }
        }
        // AR - collision detection here, with a vertical/horizontal range of collision so a rectangular 'hit box' is formed around each enemy bug
    }
}

Player.prototype.reachGoal = function () {
        goalScore++;
        goalMessage.textContent=`Achieved happiness ${goalScore} time(s)!`;
    this.resetMainPlayer();
}

Player.prototype.bugCollision = function () {
        bugScore++;
        collisionMessage.textContent=`The bugs got you ${bugScore} time(s)!`;

    this.resetMainPlayer();
}

/*
* Object instances & general variables
*/

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
let goalScore = 0;
let bugScore = 0;
let goalMessage = document.querySelector('.goal-message');
let collisionMessage = document.querySelector('.collision-message');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // see https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
    e.preventDefault(); // prevents page view from scrolling from cursor key input
    player.handleInput(allowedKeys[e.keyCode]);
});