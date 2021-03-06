var Upgrades = function () {
    // boom yeh!
    this.labelStyle = { font: '14px Arial', fill: '#ccc' };
    this.drawAtThisPlaceX = game.world.width - 30;

    this.onKilled = new Phaser.Signal();
    this.state = game.state.getCurrentState();
    this.s = this.state.settings;
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

// All the upgrades
Upgrades.prototype.all = [];

// Load all the upgrades into the main array: Upgrades.all
Upgrades.prototype.load = function(upgrade) {
    var self = this;
    require([
        'upgrades/simpleUpgrades',
        'upgrades/sentryUpgrades',
        'upgrades/otherUpgrades'
    ], function() {
        // console.log('Loading ' + simpleUpgrades.length + ' upgrades.');
        self.all = _.flatten([self.all, simpleUpgrades(), sentryUpgrades(), otherUpgrades()]);
    });

    // used for init, so we need to eturn ourselves
    return this;
};

/*
* Add all the upgrades we can afford
*/
Upgrades.prototype.addUpgrades = function() {
    // check what upgrades are in our pay grade
    this.s.upgrades_available = _.filter(this.all, function(upgrade) {
        return upgrade.price <= this.s.moneys && upgrade.count < upgrade.max;
    }, this);

    // show all the upgrades we are allows
    _(this.s.upgrades_available).forEach(function(upgrade_definition, k) {
        // add the upgrade if it is not being displayed already
        if (
            undefined === this.s.upgrade_sprites[upgrade_definition.sprite]
            && upgrade_definition.enabled
        ) {
            // console.log('Displaying upgrade: ' + upgrade_definition.sprite);

            // create an upgrade sprite
            var upgrade_sprite = game.add.sprite(game.world.width - 60, this.s.upgrade_position, 'atlas');
            upgrade_sprite.frameName = upgrade_definition.sprite;
            // allow us to click on it
            upgrade_sprite.inputEnabled = true;
            upgrade_sprite.input.useHandCursor = true; //if you want a hand cursor
            upgrade_sprite.events.onInputDown.add(function(clicked_sprite) {
                this.purchaseUpgrades(clicked_sprite);
            }, this);

            // label on the side of the upgrade button. showing used count
            upgrade_sprite.label = game.add.text(
                this.drawAtThisPlaceX,
                this.s.upgrade_position + 6,
                '  ' + upgrade_definition.count,
                this.labelStyle
            );

            // save the current position we drew our sprite
            upgrade_definition.upgrade_position = this.s.upgrade_position;

            // disable bullet fire when clicking on upgrades
            upgrade_sprite.events.onInputOver.add(function() {
                this.state[upgrade_definition.object].fireDisable = true;
                // set the mouse over text
                this.showHoverText(upgrade_definition);
            }, this);
            upgrade_sprite.events.onInputOut.add(function() {
                this.state[upgrade_definition.object].fireDisable = false;
            }, this);

            // update the upgrade incremented location
            this.s.upgrade_position = this.s.upgrade_position + upgrade_definition.size;

            // save the refrence to the sprite
            this.s.upgrade_sprites[upgrade_definition.sprite] = upgrade_sprite;
        } else { // if it is already drawn, just enable it:

            if (!upgrade_definition.enabled) {
                upgrade_definition.enabled = true; // re-enable the sprite

                // set it to use the enabled frame again
                this.s.upgrade_sprites[upgrade_definition.sprite].frameName = upgrade_definition.sprite;
            }
        }

    }, this);
};

/*
* Filter the avaiable upgrades and return the ones that are currently displayed
*
* @param {sprite} sprite - Sprite on screen
*/
Upgrades.prototype.getActiveUpgrade = function(sprite) {
    // console.log(this.s.upgrades_available);
    return _.find(this.s.upgrades_available, { 'sprite': sprite.frameName });
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

    if (this.s.moneys - upgrade.price < 0) return false; // saftey

    // update the moneys
    this.s.moneys = this.s.moneys - upgrade.price;
    this.state.scoreLabel.setText(this.s.moneys);

    // upgrade the price
    upgrade.price = upgrade.price * upgrade.priceIncrement;

    // increment the amount active and display it
    sprite.label.setText('  ' + ++upgrade.count);

    // do the upgrade action - pass the sprite clicked
    upgrade.action(this.state[upgrade.object]);

    // show the text saying what this is
    this.showUpgradeText(upgrade.name);

    // re-enable turret fire
    this.state[upgrade.object].fireDisable = false;

    // check to see if after buying this we now cannot afford others
    this.removeUpgrades();
};

/*
* Scan all upgrades and remove the ones we cannot afford anymore
*/
Upgrades.prototype.removeUpgrades = function() {
    // check all sprites showing
    // console.log(this.s.upgrade_sprites);
    _(this.s.upgrade_sprites).each(function(upgrade_sprite) {
        // these might not even be active, so check to see if they exist first (next line)
        var upgrade = this.getActiveUpgrade(upgrade_sprite);
        // and remove the ones we cannot afford
        if (upgrade && upgrade.price > this.s.moneys) {
            this.removeUpgrade(upgrade_sprite, upgrade);
        }
    }, this);
};

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
};

/**
* Show the price of the upgrade on mouseOver
*
*/
Upgrades.prototype.showHoverText = function(upgrade) {
    var text = game.add.text(
        this.drawAtThisPlaceX - 55,
        upgrade.upgrade_position + 15,
        'GD:' + upgrade.price,
        { font: "16px Arial", fill: "#fff", align: "center" }
    );
    text.anchor.set(0.5);
    game.time.events.add(Phaser.Timer.SECOND * 1, function() {
        text.destroy();
    }, this);
    // game.add.tween(text).to( { alpha: 0, y:0 }, 2000, Phaser.Easing.Linear.None, true);
};

/**
* Show the upgrade name in the middle when purchased
*
*/
Upgrades.prototype.showUpgradeText = function(text) {
    var text = game.add.text(game.world.centerX, 100, text);
    text.anchor.set(0.5);
    game.add.tween(text).to( { alpha: 0, y:0 }, 2000, Phaser.Easing.Linear.None, true);
};