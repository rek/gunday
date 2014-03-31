var simpleUpgrades = [
    // UPGRADE 1
    _.defaults({
        sprite: 'bullet-speed.png',
        name: '+1 Bullet Speed',
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

    // UPGRADE 2
    _.defaults({
        sprite: 'bullet-multiplier.png',
        name: '+1 Bullet Multiplier',
        price: 5,
        action: function(object) {
            object.fire.fireAmount++;
        }
    }, Upgrades.defaults),



];

// var simpleUpgradesPath = [

//     {


//     }

// ];