var simpleUpgrades = [
    {
        sprite: 'upgrade1', // the sprite name
        object: 'base',     // the object to apply this upgrade to
        price: 2, // the cost of this upgrade
        size: 30, // the height of the sprite
        action: function(object) {
            // upgrade if its ok to do so.
            var new_amount = object.fire.fireRate - 100;
            object.fire.fireRate = new_amount > object.fire.fireLimit ? new_amount : object.fire.fireLimit;
            // console.log('Changing ' + upgrade.type + ' from: ' + object.fire[upgrade.type] + ' -> ' + new_amount);

            // var new_amount = object.fire[upgrade.type] + upgrade.amount;
            // object.fire[upgrade.type] = new_amount > object.fire.fireLimit ? object.fire[upgrade.type] + upgrade.amount : app.fireLimit;
        }
    },
    {
        sprite: 'upgrade2',
        price: 10,
        size: 30,
        action: function(app) {
            app.fireAmount++;
        }
    }
];


// var simpleUpgradesPath = [

//     {


//     }

// ];