/*
 * toc
 * https://github.com/Melindrea/grunt-epub/libs/toc
 *
 * Copyright (c) 2014 Marie Hogebrandt
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
grunt = require('grunt'),
builder = require('xmlbuilder'),
fs = require('fs'),
mime = require('mime'),
_ = require('underscore.string');

var metafiles = module.exports = {};

metafiles.toc = function (data) {
    data = navMap(data);
    var ncx = builder.create('ncx')
            .att('xml:lang', data.language)
            .att('xmlns', 'http://www.daisy.org/z3986/2005/ncx/')
            .att('version', '2005-1')
            .dec('1.0', 'UTF-8')
            .dtd('-//NISO//DTD ncx 2005-1//EN', 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd')
        .root()
        .e('head')
            .e('meta').att('name', 'dtb:uid').att('content', data.uid).up()
            .e('meta').att('name', 'dtb:depth').att('content', data.depth).up()
            .e('meta').att('name', 'dtb:totalPageCount').att('content', 0).up()
            .e('meta').att('name', 'dtb:maxPageNumber').att('content', 0).root()

        .e('docTitle')
            .e('text', data.title).root()
        .e(data.navMap);

    return ncx.end({ pretty: true, indent: '  ', newline: '\n' });
};

metafiles.content = function (data, directories) {
    directories = grunt.file.expand(directories.map(function (dir) {
        return dir + '/**';
    }));

    var pkg = builder.create('package')
            .att('xmlns', 'http://www.idpf.org/2007/opf')
            .att('version', '2.0')
            .att('unique-identifier', 'etextno')
            .dec('1.0', 'UTF-8')
        .root()
        .e('metadata')
            .att('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
            .att('xmlns:dcterms', 'http://purl.org/dc/terms/')
            .att('xmlns:dxsi', 'http://www.w3.org/2001/XMLSchema-instance')
            .att('xmlns:opf', 'http://www.idpf.org/2007/opf')
            .e('dc:title', data.title).up()
            .e('dc:language', data.language).att('xsi:type', 'dcterms:RFC3066').up()
            .e('dc:identifier', data.uid).att('id', 'etextno').att('opf:scheme', 'UUID').up();

        if (data.keywords) {
            pkg.e('dc:subject', data.keywords.join(', ')).up();
        }

        if (data.description) {
            pkg.e('dc:subject', data.description).up();
        }

        if (data.author) {
            pkg.e('dc:creator', data.author.name).att('opf:file-as', data.author.as).up();
        }

        if (data.publisher) {
             pkg.e('dc:publisher', data.description).up();
        }

        if (data.license) {
             pkg.e('dc:righs', data.license).up();
        }

        if (data.date) {
            pkg.e('dc:date', data.date).att('opf-event', 'conversion').up();
        }

        // Now it's out of the metadata
        pkg.root();

        // Manifest
        pkg.e(manifest(data, directories));

        // Spine
        pkg.e(spine(data));
    return pkg.end({ pretty: true, indent: '  ', newline: '\n' });
};

var spine = function (data) {
    var items = [];
    var parseItems = function (item) {
        var spineItem = {
            itemref: {
                '@idref': item.name
            }
        };

        items.push(spineItem);
        if (item.items) {
            item.items.forEach(function (item) {
                parseItems(item);
            });
        }
    };

    data.spine.frontmatter.forEach(parseItems);

    // The meat of the stuff
    data.outline.forEach(parseItems);

    data.spine.backmatter.forEach(parseItems);
    return {
        'spine': {
            '@toc': 'ncx',
            '#list': items
        }
    };
};

var manifest = function (data, directories) {
    var items = [{
        item: {
            '@id': 'ncx',
            '@href': 'toc.ncx',
            '@media-type': 'application/x-dtbncx+xml'
        }
    }];
    var dirs = directories.filter(function (item) {
        var object = fs.statSync(item);
        return object.isDirectory();
    });

    var files = directories.filter(function (item) {
        var object = fs.statSync(item);
        return object.isFile();
    }).forEach(function (file) {
        var relativePath = file;
        var mediaType = mime.lookup(file);

        if (mediaType === 'application/x-dtbncx+xml' || mediaType === 'application/oebps-package+xml') {
            return true;
        }
        dirs.forEach(function (dir) {
            relativePath = relativePath.replace(dir + '/', '');
        });
        var name = relativePath;
        if (mediaType === 'text/html') {
            mediaType = 'application/xhtml+xml';
            name = name.replace('.html', '');
        }

        items.push({
            item: {
                '@id': _.slugify(name),
                '@href': relativePath,
                '@media-type': mediaType
            }
        });
        console.log(file);
    });

    return {
        'manifest': {
            '#list': items
        }
    };
};

var navMap = function (data) {
    data.depth = 1;

    var items = [];

    var parseNavPoint = function (item, level) {
        var navPoint = {
            navPoint: {
                '@id': item.name,
                '@playOrder': item.id,
                navLabel: {
                    text: item.title
                },
                content: {
                    '@src': item.name + '.html'
                }
            }
        };

        if (item.items) {
            navPoint.items = [];
            item.items.forEach(function (item) {
                navPoint.items.push(parseNavPoint(item, level +1));
            });
        }
        data.depth = level;
        return navPoint;
    };

    var navPoint = function (item) {
        items.push(parseNavPoint(item, 1));
    };

    data.spine.frontmatter.forEach(navPoint);

    // The meat of the stuff
    data.outline.forEach(navPoint);

    data.spine.backmatter.forEach(navPoint);

    data.navMap = {
        navMap: {
            '#list': items
        }
    };
    return data;
}
