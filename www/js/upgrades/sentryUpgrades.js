var sentryUpgrades = function() { return [
    _.defaults({
        sprite: 'sentry.png',
        name: '+1 Sentry',
        price: 1,
        max: 4,
        positions: [[- 30, - 30], [+ 35, - 30], [+ 30, + 30], [- 30, + 30]],
        action: function() {

            if (undefined === this.sentrys) {
                console.log('No current sentrys');
                this.sentrys = game.add.group();
                this.sentrys.enableBody = true;
            }

            var sentry = this.sentrys.create(
                game.world.centerX - this.positions[this.count-1][0],
                game.world.centerY - this.positions[this.count-1][1],
                'sentry1deploy'
            );

            // save a refrence to these settings in the sprite
            sentry.definition = this;
            // add the animation
            sentry.animations.add('deploy');
            sentry.animations.play('deploy', 10, false);
            sentry.anchor.setTo(0.5, 0.5);

            sentry.fireable = new Fireable(sentry);

            this.state = game.state.getCurrentState();

            // if killed by the killed event (ie: game over, base hit)
            this.state.upgrades.onKilled.add(function() {
                this.kill(sentry);
            }, this);

            // if killed manually (ie: sentry hit by enemy)
            sentry.events.onKilled.add(function() {
                this.kill(sentry);
            }, this);

            // watch for collision
            this.state.settings.watchEnemyCollisions.push(sentry);
            // watch for bullet hits
            this.state.settings.watchEnemyCollisions.push(sentry.fireable.bullets);

            this.timer = game.time.events.loop(Phaser.Timer.SECOND * 1, function() {
                if (this.state.settings.enemies_count > 0) {
                    // console.log('Fire event called on: ' + this.name);
                    sentry.fireable.fire(true); // true for auto aim
                }
            }, this);

        },

        kill: function(sentry) {
            this.count--;
            console.log('Sentry killed.');
            // destroy the bullets
            sentry.fireable.bullets.removeAll();
            // remove the firing timer
            game.time.events.remove(this.timer);
        }
    }, Upgrades.defaults),
]; };