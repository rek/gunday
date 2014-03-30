var Fireable = function () {
    awesome: 'yer'
}

Fireable.prototype.fireRate = 1000;
Fireable.prototype._fireCooldown = 0; // internal counter to work with fireRate
Fireable.prototype.fireLimit = 100;
Fireable.prototype.fireDisable = false; // if over an upgrade etc
Fireable.prototype.fireAmount = 1;
Fireable.prototype.speed = 150;