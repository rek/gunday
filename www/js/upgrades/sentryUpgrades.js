app.sentrys = game.add.group();
app.sentrys.enableBody = true;

var sentryUpgrades = [
    _.defaults({
        sprite: 'sentry.png',
        name: '+1 Sentry',
        price: 2,
        action: function() {

            var sentry = app.sentrys.create(
                game.world.centerX - 30,
                game.world.centerY - 30,
                'sentry1deploy'
            );

            sentry.animations.add('deploy');
            sentry.animations.play('deploy', 10, false);

            sentry.fireable = new Fireable(sentry);

            // watch for collision
            app.watchEnemyCollisions.push(sentry);

            sentry.events.onKilled.add(function() {
                console.log('Sentry killed');
                game.time.events.remove(this.timer);
            }, this);

            this.timer = game.time.events.loop(Phaser.Timer.SECOND * 1, this.fire, this);

        },
        fire: function() {
            // this.source.
        }
    }, Upgrades.defaults),
];