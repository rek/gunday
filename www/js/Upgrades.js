var Upgrades = function () {
    // boom yeh!
    this.label = { font: '14px Arial', fill: '#ccc' };
}

Upgrades.prototype.all = [];

Upgrades.prototype.load = function(upgrade) {
    var self = this;
    require(['upgrades/simpleUpgrades'], function() {
        // console.log('Loading ' + simpleUpgrades.length + ' upgrades.');
        self.all = _.flatten([self.all, simpleUpgrades]);
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
        if(undefined === app.upgrade_sprites[upgrade_definition.sprite]) {
            // console.log('Displaying upgrade: ' + upgrade_definition.sprite);

            // create an upgrade sprite
            var upgrade_sprite = game.add.sprite(game.world.width-60, app.upgrade_position, 'atlas');
            upgrade_sprite.frameName = upgrade_definition.sprite;
            upgrade_sprite.label = game.add.text(
                game.world.width-35,
                app.upgrade_position + 4,
                '  ' + upgrade_definition.count,
                this.label
            );
            upgrade_sprite.inputEnabled = true;
            upgrade_sprite.input.useHandCursor = true; //if you want a hand cursor
            upgrade_sprite.events.onInputDown.add(function(clicked_sprite) {
                this.purchaseUpgrades(clicked_sprite);
            }, this);

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
        }

    }, this);
}

/*
* Filter the avaiable upgrades and return the ones that are currently displayed
*
* @param {sprite} sprite - Sprite on screen
*/
Upgrades.prototype.getActiveUpgrade = function(sprite) {
    return _.find(app.upgrades_available, { 'sprite': sprite.key });
};

/*
* Purchase an upgrade
*
* @param {sprite} sprite - Sprite on screen
*/
Upgrades.prototype.purchaseUpgrades = function(sprite) {
    // console.log('Purchasing upgrade: ' + sprite.key);

    var upgrade = this.getActiveUpgrade(sprite);

    if(app.score - upgrade.price < 0) return false; // saftey

    // update the score
    app.score = app.score - upgrade.price;
    app.scoreLabel.setText(app.score);

    // upgrade the price
    upgrade.price = upgrade.price * upgrade.priceIncrement;

    // do upgrade
    upgrade.action(app[upgrade.object]);

    // re-enable fire
    app[upgrade.object].fireDisable = false;
    app[upgrade.object].count++;

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
        if(upgrade.price > app.score) {
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
    // console.log('Removing upgrade: ' + sprite.key);

    // reset the upgrade position
    app.upgrade_position = app.upgrade_position - upgrade.size;

    // remove the count label
    sprite.label.destroy();

    // remove upgrade button
    sprite.kill();

    // remove it from the list of upgrades
    delete app.upgrade_sprites[sprite.key];
}