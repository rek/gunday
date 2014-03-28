Upgrades.defaults = {
    sprite: 'default',// sprite name  (in loader.js)
    object: 'base',   // object to apply this upgrade to
    price: 5,         // cost of this upgrade
    priceIncrement: 2,// how much to change the price each time. (price * this)
    size: 30,         // height of the sprite
    count: 0,         // currently applied upgrades
    max: 2,           // amount of upgrades possible
    action: function(object) {
        console.log('Default upgrade action.');
    }
};

var simpleUpgrades = [
    _.merge(Upgrades.defaults, {
        sprite: 'bullet-speed.png',
        price: 5,
        action: function(object) {
            // upgrade if its ok to do so.
            var newAmount = object.fire.fireRate - 100;
            object.fire.fireRate = newAmount > object.fire.fireLimit ? newAmount : object.fire.fireLimit;
            // console.log('Changing ' + upgrade.type + ' from: ' + object.fire[upgrade.type] + ' -> ' + newAmount);

            // var newAmount = object.fire[upgrade.type] + upgrade.amount;
            // object.fire[upgrade.type] = newAmount > object.fire.fireLimit ? object.fire[upgrade.type] + upgrade.amount : app.fireLimit;
        }
    }),
    _.merge(Upgrades.defaults, {
        sprite: 'bullet-speed.png',
        price: 10,
        action: function(object) {
            object.fire.fireAmount++;
        }
    }),
    _.merge(Upgrades.defaults, {
        sprite: 'bullet-speed.png',
        price: 2,
        action: function(object) {
             // make a sentry
        }
    }),
];

// var simpleUpgradesPath = [

//     {


//     }

// ];