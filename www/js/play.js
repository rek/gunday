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
            scale: 2,
            fireRate: 200,
            nextFire: 0,
            increment_time: 0.005,
            increment_spawn: 0.05,
            bullets: 'bullet-1',
            enemy_types: ['bug1'],
            enemy_current: 0,
            enemy_speed: 60,
            enemies_alive: [],
            enemies_count: 0,
            upgrades_available: [],
            upgrades_active: {}
        };

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 800, 600, 'background');

        var x = game.world.width/2, y = game.world.height/2;

        // Display the gun on the screen
        this.base = game.add.sprite(x-10, y, 'gun_base');
        this.base.enableBody = true;
        this.base.anchor.setTo(0.5, 0.5);
        // this.base.width = 100;
        // this.base.physicsBodyType = Phaser.Physics.ARCADE;

        game.physics.enable(this.base, Phaser.Physics.ARCADE);
        this.gun = game.add.sprite(x+11-10, y+12, 'gun');
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
        app.enemies.enableBody = true;
        // instantly create some
        this.spawn_random(app.spawn_amount);
        // set timer to create more
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * app.delay, this.spawn_random, this);

        // Add a score label on the top left of the screen
        var style = { font: '30px Arial', fill: '#ffffff' };
        this.label_score = game.add.text(20, 20, '0', style);
    },

    // This function is called 60 times per second
    update: function() {
        // watch for hits
        this.game.physics.arcade.overlap(app.enemies, [this.bullets, this.base], this.enemy_hit, null, this);

        if(app.alive) {
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

    fire: function() {
        // console.log('fire!');
        if (app.alive && game.time.now > app.nextFire && this.bullets.countDead() > 0)
        {
            app.nextFire = game.time.now + app.fireRate;
            var bullet = this.bullets.getFirstDead();
            // bullet.reset(this.gun.x - 2, this.gun.y - 4);
            bullet.reset(this.base.x + 4, this.base.y + 5);
            // face outwards
            bullet.rotation = game.physics.arcade.angleToPointer(bullet) + 89.5;
            // move outwards
            game.physics.arcade.moveToPointer(bullet, 300);
        }
    },

    create_bullets: function() {
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        // this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(10, app.bullets);

        this.bullets.setAll('exists', false);
        this.bullets.setAll('visible', false);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    },

    enemy_hit: function(object, enemy) {
        // an enemy has hit the base
        if (object.key === 'gun_base') {
            // console.log('gun killed');
            app.alive = false;
            this.game.time.events.remove(this.timer);
            game.state.start('menu');

        } else { // a bullet has hit an enemy
            object.kill();
            enemy.kill();
            // increment the score
            this.label_score.setText(++app.score);
            // reduce the alive count of baddies
            app.enemies_count--;

            this.check_upgrades();

            // increment dificulity
            app.spawn_amount = Math.floor(app.spawn_amount + app.increment_spawn);

            // app.delay = app.delay - app.increment_time;
        }
    },

    check_upgrades: function() {
        // check what upgrades are in our pay grade
        app.upgrades_available = _.filter(upgrades, function(u) {
            return u.price <= app.score;
        });

        // set the first position
        var topUpgrade = 10;
        var self = this;

        // show all the upgrades we are allows
        _(app.upgrades_available).forEach(function(upgrade_definition, k) {
            // add the upgrade if it is not being displayed already
            if(undefined === app.upgrades_active[upgrade_definition.sprite]) {
                console.log('Displaying upgrade: ' + k);

                // create an upgrade
                var upgrade_sprite = game.add.sprite(game.world.width-60, topUpgrade, upgrade_definition.sprite);
                upgrade_sprite.inputEnabled = true;
                upgrade_sprite.input.useHandCursor = true; //if you want a hand cursor
                upgrade_sprite.events.onInputDown.add(function(clicked_sprite) {
                    self.purchase_upgrade(clicked_sprite);
                }, this);

                // display the next one at an incremented location
                topUpgrade = topUpgrade + upgrade_definition.size;

                // save it
                app.upgrades_active[upgrade_definition.sprite] = upgrade_definition;

            }

        });

    },

    purchase_upgrade: function(sprite) {
        console.log('Purchasing upgrade: ' + sprite.key);

        var upgrade = app.upgrades_active[sprite.key];

        sprite.kill();

        // update the score
        app.score = app.score - upgrade.price;
        this.label_score.setText(app.score);

        // remove it from the list of upgrades
        delete app.upgrades_active[sprite.key];
    },

    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    spawn_random: function(amount) {
        var max_spawn = Math.floor(Math.random() * (amount || app.spawn_amount) + 1);
        // console.log('making some bad guys: ' + max_spawn);
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
        for (var i = 0; i < max_spawn; i++)
        {
            // choose a random side
            sides['direction' + Math.floor(Math.random() * 4)]();
            // rotate in the middle
            enemy.anchor.setTo(0.5, 0.5);
            // face the base (center)
            enemy.rotation = game.physics.arcade.angleBetween(enemy, this.base) - 89.5;
            // e.body.velocity = Math.random() * 10;
            // enemy.body.angularVelocity = Math.floor(Math.random() * 100);
            enemy.body.mass = Math.random();
            // enemy.scale.x = app.scale;
            // enemy.scale.y = app.scale;
            game.physics.arcade.moveToObject(enemy, this.base, app.enemy_speed);
            app.enemies_count++;
        }

    },

    render: function() {
        game.debug.text('Spawn: ' + app.spawn_amount, 100, 20);
        // game.debug.text('Delay: ' + app.delay, 200, 45);
        game.debug.text('Alive: ' + app.enemies_count, 100, 35);

    }
};