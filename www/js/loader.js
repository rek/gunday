var mobile_found = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var libsToLoad = [
    'jquery',
    'menu',
    'play',
    'phaser'
];

var game = {},
    app  = {};

if (mobile_found) {
    console.log('MOBILE');
    // add cordova when using a mobile device
    libsToLoad.push('../cordova');
} else {
    console.log('NOT MOBILE');
    libsToLoad.push('//localhost:35729/livereload.js');
}

require(libsToLoad, function(
    $
    // ,Phaser
){

    app.score = 0;
    app.dims = {
        maxWidth: 400,
        maxHeight: 490
    }

    getWindowSizes = function() {
      var windowHeight = 0, windowWidth = 0;
      if (typeof (window.innerWidth) == 'number') {
          windowHeight = window.innerHeight;
          windowWidth = window.innerWidth;

      } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
          windowHeight = document.documentElement.clientHeight;
          windowWidth = document.documentElement.clientWidth;

      } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
         windowHeight = document.body.clientHeight;
         windowWidth = document.body.clientWidth;
      }
      return [windowWidth, windowHeight];
    }

    if (mobile_found) {
        // $(window).bind('resize', function () {
        var a = getWindowSizes();
        app.width = a[0];
        app.height = a[1];
        // }).trigger('resize');​​​
    } else {
        app.width = $(window).width() > app.dims.maxWidth ? app.dims.maxWidth : $(window).width();
        app.height = $(window).height() > app.dims.maxHeight ? app.dims.maxHeight : $(window).height();
    }

    // Initialize Phaser, and creates a 400x490px game
    game = new Phaser.Game(app.width, app.height, Phaser.AUTO, 'game_div');

    var load_state = {
        preload: function() {
            game.stage.backgroundColor = '#333';
            game.load.image('gun', 'img/gun/turret.png');
            game.load.image('gun_base', 'img/gun/base.png');
            game.load.image('bug-1', 'img/bug-1-1.png');
            game.load.image('bullet', 'img/bullet-1.png');
            game.load.image('background', 'img/bgtile.png');
            // game.load.audio('jump', 'assets/jump.wav');
        },
        create: function() {
            // When all assets are loaded, go to the 'menu' state
            game.state.start('menu');
        }
    };

    game.state.add('load', load_state);
    game.state.add('menu', menu_state);
    game.state.add('play', play_state);

    if (mobile_found) {
        document.addEventListener('deviceready', function() {
            game.state.start('load');
        }, false);
    } else {
        $(function() {
            game.state.start('load');
        });
    }

});