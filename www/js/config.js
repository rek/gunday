requirejs.config({
    paths: {
        jquery    : 'bower_components/jquery/dist/jquery.min',
        phaser    : 'bower_components/phaser/phaser.min',
        lodash    : 'bower_components/lodash/dist/lodash.min',
        // upgrades1 : 'upgrades/simpleUpgrades.js',
    },
    shim: {
        jquery : {
            exports : 'jQuery'
        },
        lodash: {
            exports: '_'
        },
        // upgrades1: {
            // deps: ['upgrades']
        // }
    },
    deps: ['loader'] // <-- run our app
});