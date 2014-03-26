var play_state = {

    // now done in loader state
    preload: function() {

    },

    // Fuction called after 'preload' to setup the game
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        app.score = 0;

        var x = game.world.width/2, y = game.world.height/2;

        // Display the bird on the screen
        this.bird = this.game.add.sprite(x/2, y/2, 'gun');
        this.bird = this.game.add.sprite(x/2, y/2, 'gun_base');
        this.bird.scale.x = 0.5;
        this.bird.scale.y = 0.5;

        // set rotation.
        this.bird.anchor.setTo(-0.2, 0.5);

        // add generic gravity
        this.game.physics.arcade.gravity.y = 300;
        this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);

        // Add gravity to the bird to make it fall
        // this.bird.gravity = new Phaser.Point(0, 1200);

        // Call the 'jump' function when the spacekey is hit
        // var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // space_key.onDown.add(this.jump, this);

        var self = this;
        this.game.input.onDown.add(function(e){
            // console.log('tapped');
            self.jump();
        }, this);

        // Create a group of 20 pipes
        this.pipes = game.add.group();
        // get a body, so we can change the gravity
        this.pipes.enableBody = true;
        // make 20
        this.pipes.createMultiple(20, 'pipe');

        this.pipes.scale.x = 0.6;
        // this.pipes.scale.y = 0.8;

        //call right up
        this.add_row_of_pipes();

        // Timer that calls 'add_row_of_pipes' ever 2.8 seconds
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 2.8, this.add_row_of_pipes, this);

        // Add a score label on the top left of the screen
        var style = { font: '30px Arial', fill: '#ffffff' };
        this.label_score = this.game.add.text(20, 20, '0', style);
    },

    // This function is called 60 times per second
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restart_game' function
        if (this.bird.inWorld == false)
            this.restart_game();

        if (this.bird.angle < 80)
            this.bird.angle += 1;

        // If the bird overlap any pipes, call 'restart_game'
        this.game.physics.arcade.collide(this.bird, this.pipes, this.hit_pipe, null, this);

    },

    // Make the bird jump
    jump: function() {
        if (this.bird.alive == false)
            return;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -200;

        // create an animation on the bird
        var animation = this.game.add.tween(this.bird);

        // Set the animation to change the angle of the sprite to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start();
    },

    hit_pipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function(p) {
            p.body.velocity.x = 0;
        }, this);
    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    // Add a pipe on the screen
    add_one_pipe: function(x, y) {
        // console.log('adding one pipe')
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);
        pipe.body.allowGravity = false;

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x -= 150;

//make him bounce
// pipe.body.collideWorldBounds = true;
// pipe.body.bounce.y = 0.8;

        pipe.checkWorldBounds = true;

        // Kill the pipe when it's no longer visible
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    add_row_of_pipes: function() {
        if (app.score >= 5)
            return this.next_level();

        var number_of_pipes = 8;
        app.hole = Math.floor(Math.random() * (number_of_pipes - 2)); //+1; <- bottom holes are hard
        // thus range is 0 - 6
        var hole_range = app.hole + 3;

        // console.log('adding pipes group, hole: ' + hole);

        for (var i = 0; i < number_of_pipes; i++) {

            if (i < app.hole || i > hole_range)
                this.add_one_pipe(600, i*60);
        }

        // make the count increment just as we pass through. eg: after 2.8 seconds
        game.time.events.add(Phaser.Timer.SECOND * 2.8, function(){
             this.label_score.setText('' + ++app.score)
        }, this);

    },

    next_level: function() {
        console.log('level passed');

        // Remove the timer
        game.time.events.remove(this.timer);

        game.time.events.add(Phaser.Timer.SECOND * 2.8, function(){
            this.game.state.start('level2_menu');
        }, this);
    },

    render: function() {
        // game.debug.text('Score: ' + this.score, 32, 32);
        // game.debug.text('Hole: ' + app.hole, 32, 62);
    }
};