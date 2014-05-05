/*
 * grunt-epub
 * https://github.com/Melindrea/grunt-epub
 *
 * Copyright (c) 2014 Marie Hogebrandt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var path = require('path'),
    exec = require('child_process').exec,
    chalk = require('chalk'),
    mustache = require('mustache'),
    metafiles = require('../libs/metafiles'),
    epubCheckVersion = '3.0.1';

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('epub', 'Creates epub from specified files', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            dest: 'epub',
            meta: {}
        }), files = path.resolve('files'), folder,
        cb = this.async();

        grunt.file.mkdir(options.dest);
        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            var name = path.resolve(options.dest + '/' + f.dest + '.epub');

            var cmd = [
                'cd ' + files,
                'zip -Xj0 ' + name + ' mimetype',
                'zip -Xur9D ' + name + ' *'
            ];

            var src = f.src.filter(function (filepath) {
            // Warn on and remove invalid source files (if nonull was set).
                if (! grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            src.forEach(function (filepath) {
                folder = path.resolve(filepath);
                cmd.push('cd ' + folder);
                cmd.push('zip -Xur9D ' + name + ' *');
            });

            // Create whatever metafiles are needed ...
            // folder now contains one of the ones in the file,
            // put the metadata files in it
            var toc = metafiles.toc(options.meta);
            grunt.file.write(folder + '/toc.ncx', toc);

            var content = metafiles.content(options.meta, src);
            // grunt.log.writeln(content);
            grunt.file.write(folder + '/content.opf', content);

            var cp = exec(cmd.join('&&'), options.execOptions, function (err, stdout, stderr) {
                if (typeof options.callback === 'function') {
                    options.callback.call(this, err, stdout, stderr, cb);
                } else {
                    if (err && options.failOnError) {
                        grunt.warn(err);
                    }
                    cb();
                }
            }.bind(this));

            // Print a success message.
            grunt.log.writeln('File "' + name + '" created.');
        });
    });

    grunt.registerMultiTask('epubCheck', 'Wrapper around epubcheck library', function () {
        var cb = this.async(),
        options = this.options({
            failOnError: true
        }),
        lib = path.resolve('libs/epubcheck-' + epubCheckVersion + '/epubcheck-' + epubCheckVersion + '.jar');

        this.files.forEach(function (f) {
            var name = path.resolve(options.dest + '/' + f.dest + '.epub');

            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (! grunt.file.exists(path.resolve(filepath))) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function (filepath) {
                var cmd = 'java -jar ' + lib + ' ' + filepath;
                var cp = exec(cmd, options.execOptions, function (err, stdout, stderr) {
                    if (typeof options.callback === 'function') {
                        options.callback.call(this, err, stdout, stderr, cb);
                    } else {
                        if (err && options.failOnError) {
                            grunt.warn('File: ' + filepath + '\n' + err);
                        }
                        cb();
                    }
                }.bind(this));
                grunt.verbose.writeln('Command:', chalk.yellow(cmd));
            });
        });
    });
};
