var Fireable = function (parent) {
    var awesome = 'yer';
    this.parent = parent;
    this.state = game.state.getCurrentState();
    // console.log('Making some bullets');

    // setup the bullets
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    // game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
    this.bullets.createMultiple(10, 'atlas' , this.type);
    this.bullets.setAll('exists', false);
    this.bullets.setAll('visible', false);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
}

Fireable.prototype.fireRate = 1000;
Fireable.prototype._fireCooldown = 0;   // internal counter to work with fireRate
Fireable.prototype.fireLimit = 100;
Fireable.prototype.fireDisable = false; // if over an upgrade etc
Fireable.prototype.fireAmount = 1;
Fireable.prototype.speed = 150;
Fireable.prototype.type = 'bullet-1.png';

Fireable.prototype.fire = function(auto) {
    var source = this.parent;
    // console.log('Firing from: ' + source.key );

    if (
        this.state.settings.alive                        // if the object is alive
        && !source.fireDisable                           // and not disabled
        && game.time.now > source.fireable._fireCooldown // timeout between bullets
        && this.bullets.countDead() > 0                  // ?
    )
    {
        // update the cool down for the next fire event
        source.fireable._fireCooldown = game.time.now + source.fireable.fireRate;

        var i = 0;
        var degrees = [ [0], [-10, 10], [-15, 0, 15] ];
        // call a set number of times
        _.times(source.fireable.fireAmount, function() {
            // console.log('Creating a bullet at: ' + bullet_angle);
            var bullet = this.bullets.getFirstDead();
            bullet.anchor.setTo(0.5, 0.5);
            // set the bullets to come from the center
            bullet.reset(source.x, source.y);

            if(auto) { // auto aim
                // var randomEnemy = this.state.enemies_alive
                // var pool = [];
                // var total = 4; // total sentrys possible? or deployed?
                // // var randomEnemy = this.state.enemies.getRandom();
                // _(this.state.enemies_alive).each(function(e) {
                //     var edge = false;
                //     // if it is the first or last, we need to loop around
                //     if (e.side == total || e.side == 0) {
                //         edge = true;
                //     }

                //     console.log(e.side);
                //     console.log(source.definition.count);
                //     // source.definition.count = the position of the sentry (currently its count)
                //     if (
                //         e.side >= source.definition.count - 1
                //         || e.side <= source.definition.count + 1
                //     ) {
                //         pool.push[e];
                //     }
                // }, this);

                // console.log('pool members: ' + pool.length);

                // randomEnemy = this.state.enemy_last;

                // if (pool.length != 0) {

                //     var selected = _.random(0, pool.length-1);

                //     console.log('selected guy: ' + selected.id);
                //     console.log(selected);

                //     var randomEnemy = this.state.enemies_alive[selected.id];

                var randomEnemy = this.state.enemy_last;

                if (randomEnemy) {

                    bullet.rotation = game.physics.arcade.angleBetween(
                        bullet,
                        randomEnemy,
                        source.fireable.speed
                    ) - 89.5;

                    game.physics.arcade.moveToObject(
                        bullet,
                        randomEnemy,
                        source.fireable.speed + 300
                    );

                }
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