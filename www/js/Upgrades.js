var Upgrades = function () {
    // boom yeh!
    this.labelStyle = { font: '14px Arial', fill: '#ccc' };
}

Upgrades.defaults = {
    sprite: 'default',// sprite name  (in loader.js)
    object: 'base',   // object to apply this upgrade to
    price: 5,         // cost of this upgrade
    priceIncrement: 2,// how much to change the price each time. (price * this)
    size: 37,         // height of the sprite
    count: 0,         // currently applied upgrades
    max: 2,           // amount of upgrades possible
    enabled: true,    // disabled makes the upgrade look grey
    action: function(object) {
        console.log('Default upgrade action.');
    }
};

Upgrades.prototype.all = [];

Upgrades.prototype.load = function(upgrade) {
    var self = this;
    require([
        'upgrades/simpleUpgrades',
        'upgrades/sentryUpgrades',
        'upgrades/otherUpgrades'
    ], function() {
        // console.log('Loading ' + simpleUpgrades.length + ' upgrades.');
        self.all = _.flatten([self.all, simpleUpgrades, sentryUpgrades, otherUpgrades]);
    });

    // used for init, so we return ourselves
    return this;
};

/*
* Add all the upgrades we can afford
*/
Upgrades.prototype.addUpgrades = function() {
    // check what upgrades are in our pay grade
    app.upgrades_available = _.filter(this.all, function(upgrade) {
        return upgrade.price <= app.score && upgrade.count < upgrade.max;
    });

    // show all the upgrades we are allows
    _(app.upgrades_available).forEach(function(upgrade_definition, k) {
        // add the upgrade if it is not being displayed already
        if (
            undefined === app.upgrade_sprites[upgrade_definition.sprite]
            && upgrade_definition.enabled
        ) {
            // console.log('Displaying upgrade: ' + upgrade_definition.sprite);

            // create an upgrade sprite
            var upgrade_sprite = game.add.sprite(game.world.width-60, app.upgrade_position, 'atlas');
            upgrade_sprite.frameName = upgrade_definition.sprite;
            // allow us to click on it
            upgrade_sprite.inputEnabled = true;
            upgrade_sprite.input.useHandCursor = true; //if you want a hand cursor
            upgrade_sprite.events.onInputDown.add(function(clicked_sprite) {
                this.purchaseUpgrades(clicked_sprite);
            }, this);

            upgrade_sprite.label = game.add.text(
                game.world.width - 30,
                app.upgrade_position + 6,
                '  ' + upgrade_definition.count,
                this.labelStyle
            );

            upgrade_sprite.events.onInputOver.add(function() {
                app[upgrade_definition.object].fireDisable = true;
            });
            upgrade_sprite.events.onInputOut.add(function() {
                app[upgrade_definition.object].fireDisable = false;
            });

            // update the upgrade incremented location
            app.upgrade_position = app.upgrade_position + upgrade_definition.size;

            // save the refrence to the sprite
            app.upgrade_sprites[upgrade_definition.sprite] = upgrade_sprite;
        } else {
            if (!upgrade_definition.enabled) {
                upgrade_definition.enabled = true; // re-enable the sprite

                // reset it to active
                // app.upgrade_sprites[upgrade_definition.sprite].frameName = upgrade_definition.sprite;
            }
        }

    }, this);
}

/*
* Filter the avaiable upgrades and return the ones that are currently displayed
*
* @param {sprite} sprite - Sprite on screen
*/
Upgrades.prototype.getActiveUpgrade = function(sprite) {
    return _.find(app.upgrades_available, { 'sprite': sprite.frameName });
};

/*
* Purchase an upgrade
*
* @param {sprite} sprite - Sprite on screen
*/
Upgrades.prototype.purchaseUpgrades = function(sprite) {
    // console.log('Purchasing upgrade: ' + sprite.frameName);

    var upgrade = this.getActiveUpgrade(sprite);

    if (!upgrade) return; // if it has been disabled it won't be here, so just return.

    if (app.score - upgrade.price < 0) return false; // saftey

    // update the score
    app.score = app.score - upgrade.price;
    app.scoreLabel.setText(app.score);

    // upgrade the price
    upgrade.price = upgrade.price * upgrade.priceIncrement;

    // increment the amount active and display it
    sprite.label.setText('  ' + ++upgrade.count);

    // do the upgrade action - pass the sprite clicked
    upgrade.action(app[upgrade.object]);

    // re-enable turret fire
    app[upgrade.object].fireDisable = false;

    // check to see if after buying this we now cannot afford others
    this.removeUpgrades();
}

/*
* Scan all upgrades and remove the ones we cannot afford anymore
*/
Upgrades.prototype.removeUpgrades = function() {
    // check all sprites showing
    _(app.upgrade_sprites).each(function(upgrade_sprite) {
        var upgrade = this.getActiveUpgrade(upgrade_sprite);
        // and remove the ones we cannot afford
        if (upgrade.price > app.score) {
            this.removeUpgrade(upgrade_sprite, upgrade);
        }
    }, this);
}

/*
* Remove one upgrade from displaying.
*
* @param {sprite} sprite - Upgrade sprite on screen
* @param {object} upgrade - Definition object of upgrade
*/
Upgrades.prototype.removeUpgrade = function(sprite, upgrade) {
    // console.log('Removing upgrade: ' + sprite.frameName);

    // reset the upgrade position
    // app.upgrade_position = app.upgrade_position - upgrade.size;

    // remove the count label
    // sprite.label.destroy();

    // remove upgrade button
    // sprite.kill();

    sprite.frameName = 'disabled-' + upgrade.sprite;
    upgrade.enabled = false;

    // remove it from the list of upgrades
    // delete app.upgrade_sprites[sprite.frameName];
}