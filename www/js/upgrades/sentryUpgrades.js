var sentryUpgrades = [
    _.defaults({
        sprite: 'sentry.png',
        name: '+1 Sentry',
        price: 2,
        action: function() {

            if (undefined === this.sentrys) {
                console.log('No current sentrys');
                this.sentrys = game.add.group();
                this.sentrys.enableBody = true;
            }

            var sentry = this.sentrys.create(
                game.world.centerX - 30,
                game.world.centerY - 30,
                'sentry1deploy'
            );

            sentry.animations.add('deploy');
            sentry.animations.play('deploy', 10, false);

            sentry.fireable = new Fireable(sentry);

            // watch for collision
            app.watchEnemyCollisions.push(sentry);

            var state = game.state.getCurrentState();
            state.upgrades.onKilled.add(function() {
                this.kill();
            }, this);

            sentry.events.onKilled.add(function() {
                this.kill();
            }, this);

            this.timer = game.time.events.loop(Phaser.Timer.SECOND * 1, function() {
                if (app.enemies_count > 0) {
                    // console.log('Fire event called on: ' + this.name);
                    sentry.fireable.fire(true); // true for auto aim
                }
            }, this);

        },

        kill: function() {
            console.log('Sentry killed.');
            game.time.events.remove(this.timer);
        }
    }, Upgrades.defaults),
];