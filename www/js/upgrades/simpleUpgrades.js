var simpleUpgrades = [
    // UPGRADE 1
    _.defaults({
        sprite: 'bullet-speed.png',
        name: '+1 Bullet Speed',
        price: 5,
        action: function(object) {
            // upgrade if its ok to do so.
            var newAmount = object.fireable.fireRate - 100;
            object.fireable.fireRate = newAmount > object.fireable.fireLimit ? newAmount : object.fireable.fireLimit;
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
            object.fireable.fireAmount++;
        }
    }, Upgrades.defaults),



];

// var simpleUpgradesPath = [

//     {


//     }

// ];