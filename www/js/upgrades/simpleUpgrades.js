var simpleUpgrades = [
    _.defaults({
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
    }, Upgrades.defaults),
    _.defaults({
        sprite: 'bullet-multiplier.png',
        price: 10,
        action: function(object) {
            object.fire.fireAmount++;
        }
    }, Upgrades.defaults),
    _.defaults({
        sprite: 'bullet-speed.png',
        price: 2,
        action: function(object) {
             // make a sentry
        }
    }, Upgrades.defaults)
];

// var simpleUpgradesPath = [

//     {


//     }

// ];