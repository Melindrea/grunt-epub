/*
 * grunt-epub
 * https://github.com/Melindrea/grunt-epub
 *
 * Copyright (c) 2014 Marie Hogebrandt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp', 'epub']
    },

    // Configuration to be run (and then tested).
    epub: {
      default_options: {
        options: {
        },
        files: {
          'default': ['test/fixtures']
        }
      },
      custom_options: {
        options: {
          dest: 'tmp/epub'
        },
        files: {
          'custom': ['test/fixtures']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  require('jit-grunt')(grunt);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'epub', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'verb']);

};
