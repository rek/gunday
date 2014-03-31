var menu_state = {
    create: function() {
        // Call the 'start' function when pressing the spacebar
        // var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // space_key.onDown.add(this.start, this);
        game.input.onTap.add(this.start, this);

        // Defining variables
        var style = { font: "30px Arial", fill: "#ffffff" };
        var x = game.world.width/2, y = game.world.height/2;

        var text = this.game.add.text(x, y-100, "GUNDAY", style);
        text.anchor.setTo(0.5, 0.5);

        text = this.game.add.text(x, y-50, "Tap to start", style);
        text.anchor.setTo(0.5, 0.5);

        text = this.game.add.text(x, y-20, "v" + app.version, style);
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