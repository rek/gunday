var play_state = {

    // now done in loader state
    preload: function() {

    },

    // Fuction called after 'preload' to setup the game
    create: function() {
        app = {
            score: 0,
            alive: true,
            delay: 2.5,
            spawn_amount: 1,
            fireRate: 200,
            nextFire: 0,
            increment_time: 0.05,
            increment_spawn: 0.05,
            bullets: 'bullet-1',
            enemy_types: ['bug-1']
        };

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 800, 600, 'background');

        var x = game.world.width/2, y = game.world.height/2;

        // Display the gun on the screen
        this.base = game.add.sprite(x, y, 'gun_base');
        this.base.enableBody = true;
        // this.base.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(this.base, Phaser.Physics.ARCADE);
        this.gun = game.add.sprite(x+11, y+12, 'gun');
        this.gun.enableBody = true;
        this.gun.anchor.setTo(0.5, 0.7); // set a good rotation point

        this.create_bullets();

        var self = this;
        this.game.input.onDown.add(function(e){
            // console.log('tapped');
            self.fire();
        }, this);

        // Create a group of enemies
        app.enemies = game.add.group();
        // get a body, so we can change the gravity
        app.enemies.enableBody = true;
        this.spawn_random(app.spawn_amount);

        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * app.delay, this.spawn_random, this);

        // Add a score label on the top left of the screen
        var style = { font: '30px Arial', fill: '#ffffff' };
        this.label_score = game.add.text(20, 20, '0', style);
    },

    // This function is called 60 times per second
    update: function() {
        this.game.physics.arcade.overlap(app.enemies, [this.bullets, this.base], this.enemy_hit, null, this);

        if(app.alive) {

            //  This will update the sprite.rotation so that it points to the currently active pointer
            //  On a Desktop that is the mouse, on mobile the most recent finger press.
            this.gun.rotation = game.physics.arcade.angleToPointer(this.gun);

            var self = this;
            app.enemies.forEach(function(enemy) {
                // game.physics.arcade.accelerateToObject(enemy, this.gun, 600, 250, 250);
                game.physics.arcade.moveToObject(enemy, self.gun)
            }, game.physics);


            // enemies.forEach(game.physics.moveToObject(player), game.physics, false, 30);
        }
    },

    fire: function() {
        // console.log('fire!');
        if (app.alive && game.time.now > app.nextFire && this.bullets.countDead() > 0)
        {
            app.nextFire = game.time.now + app.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.gun.x - 8, this.gun.y - 8);
            game.physics.arcade.moveToPointer(bullet, 300);
        }
    },

    create_bullets: function() {
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        // this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(50, app.bullets);

        this.bullets.setAll('exists', false);
        this.bullets.setAll('visible', false);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    },

    enemy_hit: function(object, enemy) {
        // an enemy has hit the base
        if (object.key === 'gun_base') {
            console.log('gun killed');
            app.alive = false;
            this.game.time.events.remove(this.timer);
            game.state.start('menu');

        } else { // a bullet has hit an enemy
            object.kill();
            enemy.kill();
            this.label_score.setText(++app.score);

            // increment dificulity
            app.spawn_amount = app.spawn_amount + app.increment_spawn;
            // app.delay = app.delay - app.increment_time;
        }
    },

    gun_killed: function() {

    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    spawn_random: function(amount) {
        var max_spawn = Math.floor(Math.random() * (amount || app.spawn_amount) + 1);
        console.log('making some bad guys: ' + max_spawn);
        var enemy;
        var sides = {
            direction0: function() {
                enemy = app.enemies.create(0, game.world.randomY, app.enemy_types[0]);
            },
            direction1: function() {
                enemy = app.enemies.create(game.world.randomX, 0, app.enemy_types[0]);
            },
            direction2: function() {
                enemy = app.enemies.create(game.world.width, game.world.randomY, app.enemy_types[0]);
            },
            direction3: function() {
                enemy = app.enemies.create(game.world.randomX, game.world.height, app.enemy_types[0]);
            },
        }
        for (var i = 0; i < max_spawn; i++)
        {
            // choose a random side
            sides['direction' + Math.floor(Math.random() * 4)]();

            // e.body.velocity = Math.random() * 10;
            // enemy.body.angularVelocity = Math.floor(Math.random() * 100);
            enemy.body.mass = Math.random();
        }
    },

    render: function() {
        game.debug.text('Spawn: ' + app.spawn_amount, 200, 30);
        // game.debug.text('Delay: ' + app.delay, 200, 45);

    }
};