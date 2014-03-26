requirejs.config({
    paths: {
        jquery                 : 'bower_components/jquery/dist/jquery.min',
        phaser                 : 'bower_components/phaser/phaser.min',
    },
    shim: {
        jquery : {
          exports : 'jQuery'
        },
    },
    deps: ['loader'] // <-- run our app
});