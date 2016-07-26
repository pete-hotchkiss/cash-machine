// Karma configuration
// Generated on Mon May 18 2015 13:35:51 GMT+0200 (CEST)
'use strict';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],

    // // frameworks to use
    // // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // frameworks: ['jasmine', 'jasmine-matchers'],




    // list of files / patterns to load in the browser
    files: [
      '../bower_components/angular/angular.min.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-hotkeys/build/hotkeys.min.js',
      '../bower_components/angular-toggle-switch/angular-toggle-switch.min.js',
      '../node_modules/jslinq/build/jslinq.min.js',
      '../node_modules/numeral/min/numeral.min.js',
      '../node_modules/numeral/min/languages/en-gb.min.js',
      '../app/scripts/directives/*.js',
      '../app/scripts/filters/*.js',
      '../app/scripts/controllers/*.js',
      '../app/scripts/dist/app.js',
      '../tests/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    client: { captureConsole: false },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
