Upgrades = function (app, game) {
  // boom yeh!
}

Upgrades.prototype.all = {
    'upgrade1': {
        sprite: 'upgrade1', // the sprite name
        price: 2, // the cost of this upgrade
        size: 30, // the height of the sprite
        type: 'fireRate', // the key to change
        amount: -10 // the amount to change it
    },
    'upgrade2': {
        sprite: 'upgrade2',
        price: 4,
        size: 30,
        type: 'fireRate',
        amount: -20
    }
};

/*
* Add all the upgrades we can afford
*/
Upgrades.prototype.addUpgrades = function() {
    // check what upgrades are in our pay grade
    app.upgrades_available = _.filter(this.all, function(u) {
        return u.price <= app.score;
    });

    var self = this;

    // show all the upgrades we are allows
    _(app.upgrades_available).forEach(function(upgrade_definition, k) {
        // add the upgrade if it is not being displayed already
        if(undefined === app.upgrade_sprites[upgrade_definition.sprite]) {
            console.log('Displaying upgrade: ' + upgrade_definition.sprite);

            // create an upgrade sprite
            var upgrade_sprite = game.add.sprite(game.world.width-60, app.upgrade_position, upgrade_definition.sprite);
            upgrade_sprite.inputEnabled = true;
            upgrade_sprite.input.useHandCursor = true; //if you want a hand cursor
            upgrade_sprite.events.onInputDown.add(function(clicked_sprite) {
                self.purchaseUpgrades(clicked_sprite);
            }, this);

            upgrade_sprite.events.onInputOver.add(function() {
                app.fireDisable = true;
            });
            upgrade_sprite.events.onInputOut.add(function() {
                app.fireDisable = false;
            });

            // update the upgrade incremented location
            app.upgrade_position = app.upgrade_position + upgrade_definition.size;

            // save the refrence to the sprite
            app.upgrade_sprites[upgrade_definition.sprite] = upgrade_sprite;
        }

    });
}

/*
* Purchase an upgrade
*/
Upgrades.prototype.purchaseUpgrades = function(sprite) {
    console.log('Purchasing upgrade: ' + sprite.key);

    var upgrade = this.all[sprite.key];

    if(app.score - upgrade.price < 0) return false; // saftey

    // update the score
    app.score = app.score - upgrade.price;
    app.score_label.setText(app.score);

    // do upgrade
    var new_amount = app[upgrade.type] + upgrade.amount;
    // console.log('Changing ' + upgrade.type + ' from: ' + app[upgrade.type] + ' -> ' + new_amount);

    // make sure it stays above 0
    app[upgrade.type] = new_amount > 0 ? app[upgrade.type] + upgrade.amount : 0;

    // re-enable fire
    app.fireDisable = false;

    // check to see if after buying this we now cannot afford others
    this.removeUpgrades();
}

/*
* Scan all upgrades and remove the ones we cannot afford anymore
*/
Upgrades.prototype.removeUpgrades = function() {
    // check all sprites showing
    _(app.upgrade_sprites).each(function(upgrade_sprite) {
        var upgrade = this.all[upgrade_sprite.key];
        // and remove the ones we cannot afford
        if(upgrade.price > app.score) {
            this.removeUpgrade(upgrade_sprite);
        }

    }, this);
}

/*
* Remove one upgrade from displaying.
*/
Upgrades.prototype.removeUpgrade = function(sprite) {
    console.log('Removing upgrade: ' + sprite.key);
    var upgrade = this.all[sprite.key];

    // reset the upgrade position
    app.upgrade_position = app.upgrade_position - upgrade.size;

    // remove upgrade button
    sprite.kill();

    // remove it from the list of upgrades
    delete app.upgrade_sprites[sprite.key];
}