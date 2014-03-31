var play_state = {

    preload: function() {
        // only loaded once.
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    // Fuction called after 'preload' to setup the game
    create: function() {
        app = _.defaults({
            score: 0,
            alive: true,
            delay: 2.5,
            spawn_amount: 1,
            scale: 2,
            increment_time: 0.005,
            increment_spawn: 0.05, // the rate enemy spawing is quickened
            bullet: 'bullet-1.png',
            enemy_types: ['bug1walk'],
            enemy_current: 0,
            enemy_speed: 60,
            enemies_alive: [],
            enemies_count: 0,
            upgrade_position: 10, // where to show the next upgrade
            upgrade_sprites: {}, // once made, here is a list of the sprites
            upgrades_available: [], // all the upgrade definitions that are available
        }, app);

        // setup the upgrades
        app.upgrades = new Upgrades().load();

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 800, 600, 'atlas', 'bgtile.png');

        // Display the gun on the screen
        app.base = game.add.sprite(game.world.centerX - 11, game.world.centerY, 'atlas');
        app.base.frameName = 'base.png';
        app.base.enableBody = true;
        app.base.anchor.setTo(0.5, 0.5);
        game.physics.enable(app.base, Phaser.Physics.ARCADE);

        this.gun = game.add.sprite(game.world.centerX + 0.5, game.world.centerY + 11, 'atlas');
        this.gun.frameName = 'turret.png';
        this.gun.enableBody = true;
        this.gun.anchor.setTo(0.5, 0.68); // set a good rotation point

        // setup the bullets
        this.create_bullets();
        app.watchEnemyCollisions = [this.bullets, app.base]

        // add the fire stuff to the base
        app.base.fire = new Fireable();

        var self = this;
        this.game.input.onDown.add(function(e){
            // console.log('tapped');
            self.fire(app.base);
        }, this);

        // Create a group of enemies
        app.enemies = game.add.group();
        app.enemies.enableBody = true;
        // instantly create some
        this.spawn_random(app.spawn_amount);
        // set timer to create more
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * app.delay, this.spawn_random, this);

        // Add a score label on the top left of the screen
        app.style  = { font: '30px Arial', fill: '#ffffff' };
        app.scoreLabel = game.add.text(20, 20, '0', app.style);
    },

    // This function is called 60 times per second
    update: function() {
        // watch for hits
        this.game.physics.arcade.overlap(app.enemies, app.watchEnemyCollisions, this.enemy_hit, null, this);

        // this.onComplete = new Phaser.Signal();
        // this.onComplete.dispatch(this);
        // if ( this._onUpdateCallback !== null ) {
        //     this._onUpdateCallback.call(this);
        // }

        if (app.alive) {
            //  This will update the sprite.rotation so that it points to the currently active pointer
            //  On a Desktop that is the mouse, on mobile the most recent finger press.
            this.gun.rotation = game.physics.arcade.angleToPointer(this.gun) + 89.5;

            // var self = this;
            // update position of all enemies
            // app.enemies.forEach(function(enemy) {
                // game.physics.arcade.accelerateToObject(enemy, self.base, 50, 250, 250);
                // game.physics.arcade.moveToObject(enemy, self.base)
            // }, game.physics);
        }
    },

    fire: function(source) {
        // console.log('Firing from: ' + source.key );
        // var fireable = app.fireables[source.key]; // get the object that is to be fired from
        var fireable = source.fire;
        if (
                app.alive                                 // if the object is alive
                && !source.fireDisable                    // and not disabled
                && game.time.now > fireable._fireCooldown // timeout between bullets
                && this.bullets.countDead() > 0           // ?
            )
        {
            // update the cool down for the next fire event
            fireable._fireCooldown = game.time.now + fireable.fireRate;

            var i = 0;
            var degrees = [ [0], [-10, 10], [-15, 0, 15] ];
            _.times(fireable.fireAmount, function() {
                // console.log('Creating a bullet at: ' + bullet_angle);
                var bullet = this.bullets.getFirstDead();
                bullet.anchor.setTo(0.5, 0.5);
                // set the bullets to come from the center
                bullet.reset(source.x, source.y);
                // face outwards
                bullet_angle = degrees[fireable.fireAmount-1][i++];
                // make bullet face outwards
                bullet.rotation = game.physics.arcade.angleToPointer(bullet) + 1.5;

                // move outwards
                game.physics.arcade.moveToXY(bullet, game.input.worldX + bullet_angle, game.input.worldY + bullet_angle, fireable.speed);
                // game.physics.arcade.moveToPointer(bullet, 300);

            }, this);
        }
    },

    create_bullets: function() {
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        // game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
        this.bullets.createMultiple(10, 'atlas' , app.bullet);
        this.bullets.setAll('exists', false);
        this.bullets.setAll('visible', false);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    },

    /**
    * When something hits an enemy
    *
    * @param {sprite} object - Object hitting the enemy
    * @param {sprite} enemy - Enemy being hit
    */
    enemy_hit: function(object, enemy) {
        // an enemy has hit the base
        if (object.frameName === app.base.frameName) {
            // console.log('gun killed');
            app.alive = false;
            this.game.time.events.remove(this.timer);
            game.state.start('menu');

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
            // app.score = app.score + (enemy.health >= 0 ? 1 : 0);
            app.scoreLabel.setText(++app.score);

            enemy.kill();
            // reduce the alive count of baddies
            app.enemies_count--;
// }

            object.kill();
            // check for new upgrades
            app.upgrades.addUpgrades();
            // increment dificulity
            app.spawn_amount = Math.floor(app.spawn_amount + app.increment_spawn);

            // app.delay = app.delay - app.increment_time;
        }
    },

    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);
        // Start the 'menu' state, which restarts the game
        this.game.state.start('menu');
    },

    /*
    * Create enemies
    *
    * @param {int} amount - Amount of the current enemy to create
    */
    spawn_random: function(amount) {
        // pick a random number upto the max to set as new max
        var max_spawn = Math.floor(Math.random() * (amount || app.spawn_amount) + 1);
        // console.log('Just making some bad guys: ' + max_spawn);
        var enemy;
        var sides = {
            direction0: function() {
                enemy = app.enemies.create(0, game.world.randomY, app.enemy_types[app.enemy_current]);
            },
            direction1: function() {
                enemy = app.enemies.create(game.world.randomX, 0, app.enemy_types[app.enemy_current]);
            },
            direction2: function() {
                enemy = app.enemies.create(game.world.width, game.world.randomY, app.enemy_types[app.enemy_current]);
            },
            direction3: function() {
                enemy = app.enemies.create(game.world.randomX, game.world.height, app.enemy_types[app.enemy_current]);
            },
        }

        for (var i = 0; i < max_spawn; i++) {
            // choose a random side to spawn from
            sides['direction' + Math.floor(Math.random() * 4)]();
            // rotate in the middle
            enemy.anchor.setTo(0.5, 0.5);
            // animate the movement
            enemy.animations.add('walk');
            enemy.animations.play('walk', 15, true);
            // face the base (center)
            enemy.rotation = game.physics.arcade.angleBetween(enemy, app.base) - 89.5;
            // e.body.velocity = Math.random() * 10;
            // enemy.body.angularVelocity = Math.floor(Math.random() * 100);
            enemy.body.mass = Math.random();
            // enemy.scale.x = app.scale;
            // enemy.scale.y = app.scale;
            game.physics.arcade.moveToObject(enemy, app.base, app.enemy_speed);
            app.enemies_count++;
        }

    },

    addText: function(text) {
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = game.add.text(game.world.centerX, 100, text);

        text.anchor.set(0.5);

        // text.anchor.setTo(0.5);
        // game.time.events.add(Phaser.Timer.SECOND * 2, this.fadeObject, text);

// var bounce= this.game.add.tween(scoreText);

//         bounce.to({ x: xx, y: yy-60 }, 1000 + Math.random() * 3000, Phaser.Easing.Linear.In);

//         bounce.start();

        // game.physics.arcade.moveToXY(text, game.input.worldX, 0, 50);
        game.add.tween(text).to( { alpha: 0, y:0 }, 2000, Phaser.Easing.Linear.None, true);

    },

    render: function() {
        game.debug.text('Spawn: ' + app.spawn_amount, 100, 20);
        // game.debug.text('Delay: ' + app.delay, 200, 45);
        game.debug.text('Alive: ' + app.enemies_count, 100, 35);
        game.debug.text('Upgrades: ' + app.upgrades_available.length, 100, 50);
        // game.debug.text('Upgrades: ' + app.upgrades_available.length, 100, 50);
        game.debug.text('Firerate: ' + app.base.fire.fireRate, 100, 65);

    }
};