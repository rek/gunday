var sentryUpgrades = [
    _.merge(Upgrades.defaults, {
        sprite: 'sentry1',
        price: 5,
        action: function(app) {
            app.sentrys[this.count] = game.add.sprite(game.world.centerX+0.5, game.world.centerY+11, 'gun');

            this.count++;
        }
    }
];