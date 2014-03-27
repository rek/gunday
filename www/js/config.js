requirejs.config({
    paths: {
        jquery                 : 'bower_components/jquery/dist/jquery.min',
        phaser                 : 'bower_components/phaser/phaser.min',
        lodash                 : 'bower_components/lodash/dist/lodash.min',
    },
    shim: {
        jquery : {
          exports : 'jQuery'
        },
        lodash: {
            exports: '_'
        }
    },
    deps: ['loader'] // <-- run our app
});