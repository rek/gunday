var play_state = {

    // now done in loader state
    preload: function() {

    },

    // Fuction called after 'preload' to setup the game
    create: function() {
        app.score = 0;
        app.alive = true;

        app.fireRate = 200;
        app.nextFire = 0;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 800, 600, 'background');

        var x = game.world.width/2, y = game.world.height/2;


        // Display the gun on the screen
        this.base = game.add.sprite(x, y, 'gun_base');
        this.gun = game.add.sprite(x+11, y+12, 'gun');
        this.gun.enableBody = true;
        this.gun.anchor.setTo(0.5, 0.7);

        this.create_bullet();

        var self = this;
        this.game.input.onDown.add(function(e){
            // console.log('tapped');
            self.fire();
        }, this);

        // Create a group of enemies
        this.enemies = game.add.group();
        // get a body, so we can change the gravity
        this.enemies.enableBody = true;
        // make 20
        // this.enemies.createMultiple(20, 'bug-1-1');
        this.spawn_random(4);

        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 1.8, this.spawn_random, this);


        // Add a score label on the top left of the screen
        var style = { font: '30px Arial', fill: '#ffffff' };
        this.label_score = game.add.text(20, 20, '0', style);
    },

    // This function is called 60 times per second
    update: function() {
        this.game.physics.arcade.collide(this.bullets, this.enemies, this.enemy_killed, null, this);

        if(app.alive) {

            //  This will update the sprite.rotation so that it points to the currently active pointer
            //  On a Desktop that is the mouse, on mobile the most recent finger press.
            this.gun.rotation = game.physics.arcade.angleToPointer(this.gun);

            var self = this;
            this.enemies.forEach(function(enemy) {
                // game.physics.arcade.accelerateToObject(enemy, this.gun, 600, 250, 250);
                game.physics.arcade.moveToObject(enemy, self.gun)
            }, game.physics);

            // enemies.forEach(game.physics.moveToObject(player), game.physics, false, 30);
        }
    },

    fire: function() {
        // console.log('fire!');
        if (game.time.now > app.nextFire && this.bullets.countDead() > 0)
        {
            app.nextFire = game.time.now + app.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.gun.x - 8, this.gun.y - 8);

            game.physics.arcade.moveToPointer(bullet, 300);
        }
    },

    create_bullet: function() {
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(50, 'bullet-1');


        this.bullets.setAll('exists', false);
        this.bullets.setAll('visible', false);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    },

    enemy_killed: function(bullet, enemy) {
        // console.log(e);
        bullet.kill();
        enemy.kill();
    },

    dead: function() {
        app.alive = false;
    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    spawn_random: function(amount) {
        // console.log('making some bad guys');
        var side = (amount || 4) / 4;
        ran = function(e) {

            // e.body.velocity = Math.random() * 10;
            // e.body.angularVelocity = Math.random() * 1000;
            e.body.mass = Math.random();

        }
        for (var i = 0; i < side; i++)
        {
            var enemy = this.enemies.create(0, game.world.randomY, 'bug-1');
            ran(enemy);
        }
        for (var i = 0; i < side; i++)
        {
            var enemy = this.enemies.create(game.world.randomX, 0, 'bug-1');
            ran(enemy);
        }
        for (var i = 0; i < side; i++)
        {
            var enemy = this.enemies.create(game.world.width, game.world.randomY, 'bug-1');
            ran(enemy);
        }
        for (var i = 0; i < side; i++)
        {
            var enemy = this.enemies.create(game.world.randomX, game.world.height, 'bug-1');
            ran(enemy);
        }
    },

    add_one_enemy: function(x, y) {
        console.log('adding guy');

        // console.log('adding one enemy')
        // Get the first dead enemy of our group
        var enemy = this.enemies.getFirstDead();

        // Set the new position of the enemy
        enemy.reset(x, y);
        enemy.body.allowGravity = false;

        // Add velocity to the enemy to make it move left
        enemy.body.velocity.x -= 150;

        enemy.checkWorldBounds = true;

        // Kill the enemy when it's no longer visible
        enemy.outOfBoundsKill = true;
    },

    render: function() {
        // game.debug.text('Score: ' + this.score, 32, 32);
        // game.debug.text('Hole: ' + app.hole, 32, 62);
    }
};