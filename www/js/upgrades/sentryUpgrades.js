app.sentrys = game.add.group();
app.sentrys.enableBody = true;

var sentryUpgrades = [
    _.defaults({
        sprite: 'bullet-speed.png',
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

            // watch for collision
            app.watchEnemyCollisions.push(sentry);

            sentry.events.onKilled.add(function() {
              console.log('killed');
            });

            game.state.getCurrentState().addText(this.name);

            // app.sentrys[this.count].frameName = this.sprite;
        }
    }, Upgrades.defaults),
];