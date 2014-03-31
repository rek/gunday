var sentryUpgrades = function() { return [
    _.defaults({
        sprite: 'sentry.png',
        name: '+1 Sentry',
        price: 1,
        max: 4,
        positions: [[- 50, - 50], [+ 30, - 50], [+ 30, + 30], [- 50, + 30]],
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

            sentry.animations.add('deploy');
            sentry.animations.play('deploy', 10, false);
            sentry.anchor.setTo(0.5, 0.5);

            sentry.fireable = new Fireable(sentry);

            this.state = game.state.getCurrentState();
            this.state.upgrades.onKilled.add(function() {
                this.kill();
            }, this);

            sentry.events.onKilled.add(function() {
                this.kill();
            }, this);

            // watch for collision
            this.state.settings.watchEnemyCollisions.push(sentry);

            this.timer = game.time.events.loop(Phaser.Timer.SECOND * 1, function() {
                if (this.state.settings.enemies_count > 0) {
                    // console.log('Fire event called on: ' + this.name);
                    sentry.fireable.fire(true); // true for auto aim
                }
            }, this);

        },

        kill: function() {
            this.count--;
            console.log('Sentry killed.');
            game.time.events.remove(this.timer);
        }
    }, Upgrades.defaults),
]; };