module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine-jquery', 'jasmine'],

    files: [
      // libraries
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      // our app
      'src/ez-tabs.js',
      'dist/ez-tabs-tpl.min.js',

      // tests
      'test/*Spec.js',
    ],

    port: 1245,

    browsers: ['Chrome']
  });
};
