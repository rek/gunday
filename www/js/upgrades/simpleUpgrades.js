var simpleUpgrades = [
    {
        sprite: 'upgrade1', // the sprite name
        object: 'base',     // the object to apply this upgrade to
        price: 5, // the cost of this upgrade
        size: 30, // the height of the sprite
        action: function(app) {
            // upgrade if its ok to do so.
            var new_amount = app.fireRate - 100;
            app.fireRate = new_amount > app.fireLimit ? new_amount : app.fireLimit;
            // console.log('Changing ' + upgrade.type + ' from: ' + app[upgrade.type] + ' -> ' + new_amount);

            // var new_amount = app[upgrade.type] + upgrade.amount;
            // app[upgrade.type] = new_amount > app.fireLimit ? app[upgrade.type] + upgrade.amount : app.fireLimit;
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