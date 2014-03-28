var Upgrades = function () {
    // boom yeh!
}

Upgrades.prototype.all = [];

Upgrades.prototype.load = function(upgrade) {
    var self = this;
    require(['upgrades/simpleUpgrades'], function() {
        // console.log('Loading ' + simpleUpgrades.length + ' upgrades.');
        self.all = _.union(self.all, simpleUpgrades);
    });

    return this;
};

/*
* Add all the upgrades we can afford
*/
Upgrades.prototype.addUpgrades = function() {
    // check what upgrades are in our pay grade
    app.upgrades_available = _.filter(this.all, function(u) {
        return u.price <= app.score;
    });

    // show all the upgrades we are allows
    _(app.upgrades_available).forEach(function(upgrade_definition, k) {
        // add the upgrade if it is not being displayed already
        if(undefined === app.upgrade_sprites[upgrade_definition.sprite]) {
            // console.log('Displaying upgrade: ' + upgrade_definition.sprite);

            // create an upgrade sprite
            var upgrade_sprite = game.add.sprite(game.world.width-60, app.upgrade_position, upgrade_definition.sprite);
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
*/
Upgrades.prototype.getActiveUpgrade = function(sprite) {
    return _.find(app.upgrades_available, { 'sprite': sprite.key });
};

/*
* Purchase an upgrade
*/
Upgrades.prototype.purchaseUpgrades = function(sprite) {
    // console.log('Purchasing upgrade: ' + sprite.key);

    var upgrade = this.getActiveUpgrade(sprite);

    if(app.score - upgrade.price < 0) return false; // saftey

    // update the score
    app.score = app.score - upgrade.price;
    app.score_label.setText(app.score);

    // do upgrade
    upgrade.action(app[upgrade.object]);

    // re-enable fire
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
        if(upgrade.price > app.score) {
            this.removeUpgrade(upgrade_sprite, upgrade);
        }
    }, this);
}

/*
* Remove one upgrade from displaying.
*
* @param sprite  {sprite} Upgrade sprite on screen
* @param upgrade {object} Definition object of upgrade
*/
Upgrades.prototype.removeUpgrade = function(sprite, upgrade) {
    // console.log('Removing upgrade: ' + sprite.key);

    // reset the upgrade position
    app.upgrade_position = app.upgrade_position - upgrade.size;

    // remove upgrade button
    sprite.kill();

    // remove it from the list of upgrades
    delete app.upgrade_sprites[sprite.key];
}