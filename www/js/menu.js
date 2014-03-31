var menu_state = {
    create: function() {
        app.version = '0.4.0';

        // Call the 'start' function when pressing the spacebar
        // var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // space_key.onDown.add(this.start, this);
        game.input.onTap.add(this.start, this);

        var text = this.game.add.text(game.world.centerX, 90, "GUNDAY", { font: "40px Arial", fill: "#000", 'strokeThickness': 2 });
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        text.anchor.setTo(0.5, 0.5);

        text = this.game.add.text(game.world.centerX, game.world.centerY, "- Tap to start -", { font: "30px Arial", fill: "#ffffff" });
        text.anchor.setTo(0.5, 0.5);

        text = this.game.add.text(game.world.centerX, game.world.centerY-20, "v" + app.version, { font: "12px Arial", fill: "#ccc" });
        text.anchor.setTo(0.5, 0.5);

        // If the user already played
        if (app.score > 0) {
            // Display its score
            // var score_label = this.game.add.text(x, y+50, "Final score: " + app.score.toString(), style);
            // score_label.anchor.setTo(0.5, 0.5);
        }
    },

    // Start the actual game
    start: function() {
        this.game.state.start('play');
    }
};