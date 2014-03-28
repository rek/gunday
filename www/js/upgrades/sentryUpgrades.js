var sentryUpgrades = [
    _.merge(Upgrades.defaults, {
        sprite: 'sentry1',
        price: 5,
        action: function(app) {
            app.sentrys[this.count] = game.add.sprite(
                game.world.centerX - 10,
                game.world.centerY + 10,
                'atlas'
            );

            app.sentrys[this.count].frameName = this.sprite;




        }
    }
];