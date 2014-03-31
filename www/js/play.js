/*
* States are reset at state change. So keep all game vars in 'this'
*/
var play_state = {

    preload: function() {
        // only loaded once.
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    // Fuction called after 'preload' to setup the game
    create: function() {
        app.score = 0;
        this.settings = { // smoke everything each time
            moneys: 0,
            alive: true,
            delay: 1.8, // spawn delay
            spawn_amount: 1,
            // scale: 2,
            increment_time: 0.005,
            increment_spawn: 0.25,   // the rate enemy spawing is quickened
            enemy_types: ['bug1walk'],
            enemy_current: 0,
            enemy_speed: 60,
            enemies_count: 0,
            upgrade_position: 10,    // where to show the next upgrade
            upgrade_sprites: {},     // once made, here is a list of the sprites
            upgrades_available: [],  // all the upgrade definitions that are available
            watchEnemyCollisions: [] // watch these for collisions with enemies
        };

        this.enemies_alive = [];     // the active enemies
        this.enemy_last = null;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        // setup the upgrades
        this.upgrades = new Upgrades().load();

        // load the background
        game.add.tileSprite(0, 0, 800, 600, 'atlas', 'bgtile.png');
        // Add a score label on the top left of the screen
        this.moneysLabel = game.add.text(10, 5, 'GD: 0', { font: '20px Arial', fill: '#ffffff' });
        this.scoreLabel = game.add.text(10, 25, 'Score: 0', { font: '20px Arial', fill: '#ffffff' });

        // Display the gun on the screen
        this.base = game.add.sprite(game.world.centerX - 11, game.world.centerY, 'atlas');
        this.base.frameName = 'base.png';
        this.base.enableBody = true;
        this.base.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.base, Phaser.Physics.ARCADE);

        this.gun = game.add.sprite(game.world.centerX + 0.5, game.world.centerY + 11, 'atlas');
        this.gun.frameName = 'turret.png';
        this.gun.enableBody = true;
        this.gun.anchor.setTo(0.5, 0.68); // set a good rotation point

        // add the fire stuff to the base
        this.base.fireable = new Fireable(this.base);

        this.settings.watchEnemyCollisions = [this.base.fireable.bullets, this.base];

        game.input.onDown.add(function(e){
            // console.log('tapped');
            this.base.fireable.fire();
        }, this);

        // Create a group of enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        // instantly create some enemies
        this.spawn_random(this.settings.spawn_amount);
        // set timer to create more
        this.timer = game.time.events.loop(Phaser.Timer.SECOND * this.settings.delay, this.spawn_random, this);
    },

    // This function is called 60 times per second
    update: function() {
        // watch for hits
        game.physics.arcade.overlap(this.enemies, this.settings.watchEnemyCollisions, this.enemy_hit, null, this);

        // this.onComplete = new Phaser.Signal();
        // this.onComplete.dispatch(this);
        // if ( this._onUpdateCallback !== null ) {
        //     this._onUpdateCallback.call(this);
        // }

        if (this.settings.alive) {
            //  This will update the sprite.rotation so that it points to the currently active pointer
            //  On a Desktop that is the mouse, on mobile the most recent finger press.
            this.gun.rotation = game.physics.arcade.angleToPointer(this.gun) + 89.5;

            // var self = this;
            // update position of all enemies
            // this.enemies.forEach(function(enemy) {
                // game.physics.arcade.accelerateToObject(enemy, self.base, 50, 250, 250);
                // game.physics.arcade.moveToObject(enemy, self.base)
            // }, game.physics);
        }
    },

    /**
    * When something hits an enemy
    *
    * @param {sprite} object - Object hitting the enemy
    * @param {sprite} enemy - Enemy being hit
    */
    enemy_hit: function(object, enemy) {
        // an enemy has hit the base
        if (object.frameName === this.base.frameName) {
            this.restart_game();
        } else { // a bullet has hit an enemy
            // check to make sure this enemy is alive
            // console.log(enemy.alive);

            // enemy.alive = false;
            // increment the score

// if(enemy.alive) {
//     enemy.alive = false;
//     enemy.exists = false;
//     enemy.visible = false;
            // enemy.health--;
            // this.settings.score = this.settings.score + (enemy.health >= 0 ? 1 : 0);
            this.moneysLabel.setText('GD: ' + ++this.settings.moneys);
            this.scoreLabel.setText('Score: ' + ++app.score);

            delete this.enemies_alive[enemy.id];

            enemy.kill();
            // reduce the alive count of baddies
            this.settings.enemies_count--;
// }

            object.kill();
            // check for new upgrades
            this.upgrades.addUpgrades();
            // increment dificulity
            this.settings.spawn_amount = this.settings.spawn_amount + this.settings.increment_spawn;
            // this.settings.delay = this.settings.delay - this.settings.increment_time;
        }
    },

    /*
    * It's all over folks.
    *
    * Reset everything and goto the menu state.
    */
    restart_game: function() {
        this.settings.alive = false;
        this.upgrades.onKilled.dispatch(this);
        // Remove the timer
        game.time.events.remove(this.timer);
        // Start the 'menu' state, which restarts the game
        game.state.start('menu');
    },

    /*
    * Create enemies
    *
    * @param {int} amount - Amount of the current enemy to create
    */
    spawn_random: function(amount) {
        // pick a random number upto the max to set as new max
        var max_spawn = Math.floor(Math.random() * (amount || this.settings.spawn_amount) + 1);
        // console.log('Just making some bad guys: ' + max_spawn);
        var enemy;
        var self = this;
        var anEnemyType = this.settings.enemy_types[this.settings.enemy_current];
        var sides = {
            direction0: function() {
                enemy = self.enemies.create(0, game.world.randomY, anEnemyType);
            },
            direction1: function() {
                enemy = self.enemies.create(game.world.randomX, 0, anEnemyType);
            },
            direction2: function() {
                enemy = self.enemies.create(game.world.width, game.world.randomY, anEnemyType);
            },
            direction3: function() {
                enemy = self.enemies.create(game.world.randomX, game.world.height, anEnemyType);
            },
        }

        for (var i = 0; i < max_spawn; i++) {
            var side = Math.floor(Math.random() * 4);
            // choose a random side to spawn from
            sides['direction' + side]();
            // rotate in the middle
            enemy.anchor.setTo(0.5, 0.5);
            // save the side its from (for auto targeting)
            enemy.side = side + 1;
            // animate the movement
            enemy.animations.add('walk');
            enemy.animations.play('walk', 15, true);
            // face the base (center)
            enemy.rotation = game.physics.arcade.angleBetween(enemy, this.base) - 89.5;
            // e.body.velocity = Math.random() * 10;
            // enemy.body.angularVelocity = Math.floor(Math.random() * 100);
            enemy.body.mass = Math.random();
            // enemy.scale.x = this.settings.scale;
            // enemy.scale.y = this.settings.scale;
            game.physics.arcade.moveToObject(enemy, this.base, this.settings.enemy_speed);
            this.settings.enemies_count++;

            enemy.id = this.settings.enemies_count - 1;
            // this.enemies_alive.push(enemy);
            // store it by key, so we can get it back easy when he is dead
            this.enemies_alive[enemy.id] = enemy;
            this.enemy_last = enemy;
        }

    },

    render: function() {
        game.debug.text('Spawn: ' + Math.floor(this.settings.spawn_amount), 120, 20);
        // game.debug.text('Delay: ' + this.settings.delay, 200, 45);
        game.debug.text('Alive: ' + this.settings.enemies_count, 120, 35);
        game.debug.text('Upgrades: ' + this.settings.upgrades_available.length, 120, 50);
        // game.debug.text('Upgrades: ' + this.settings.upgrades_available.length, 120, 50);
        game.debug.text('Firerate: ' + this.base.fireable.fireRate, 120, 65);

    }
};