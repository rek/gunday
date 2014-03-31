var Fireable = function (parent) {
    var awesome = 'yer';
    this.parent = parent;
}

Fireable.prototype.fireRate = 1000;
Fireable.prototype._fireCooldown = 0; // internal counter to work with fireRate
Fireable.prototype.fireLimit = 100;
Fireable.prototype.fireDisable = false; // if over an upgrade etc
Fireable.prototype.fireAmount = 1;
Fireable.prototype.speed = 150;

Fireable.prototype.fire = function(auto) {
    var source = this.parent;
    var state = game.state.getCurrentState();
    // console.log('Firing from: ' + source.key );

    if (
        app.alive                                        // if the object is alive
        && !source.fireDisable                           // and not disabled
        && game.time.now > source.fireable._fireCooldown // timeout between bullets
        && state.bullets.countDead() > 0                       // ?
    )
    {
        // update the cool down for the next fire event
        source.fireable._fireCooldown = game.time.now + source.fireable.fireRate;

        var i = 0;
        var degrees = [ [0], [-10, 10], [-15, 0, 15] ];
        // call a set number of times
        _.times(source.fireable.fireAmount, function() {
            // console.log('Creating a bullet at: ' + bullet_angle);
            var bullet = state.bullets.getFirstDead();
            bullet.anchor.setTo(0.5, 0.5);
            // set the bullets to come from the center
            bullet.reset(source.x, source.y);

            if(auto) { // auto aim
                var randomEnemy = state.enemies.getRandom();

                game.physics.arcade.angleBetween(
                    bullet,
                    randomEnemy,
                    source.fireable.speed
                );

                game.physics.arcade.moveToObject(
                    bullet,
                    randomEnemy,
                    source.fireable.speed
                );
            } else {
                // make bullet face outwards
                bullet.rotation = game.physics.arcade.angleToPointer(bullet) + 1.5;
                // set bullet angle offset
                bullet_angle = degrees[source.fireable.fireAmount-1][i++];
                // move outwards
                game.physics.arcade.moveToXY(
                    bullet,
                    game.input.worldX + bullet_angle,
                    game.input.worldY + bullet_angle,
                    source.fireable.speed
                );
            }

            // game.physics.arcade.moveToPointer(bullet, 300);

        }, this);
    }
}