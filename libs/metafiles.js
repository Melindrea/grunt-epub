/*
 * toc
 * https://github.com/Melindrea/grunt-epub/libs/toc
 *
 * Copyright (c) 2014 Marie Hogebrandt
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var grunt = require('grunt');
var builder = require('xmlbuilder');
var fs = require('fs');
var mime = require('mime');
var _ = require('underscore.string');

var metafiles = module.exports = {};

metafiles.toc = data => {
    data = navMap(data);
    var ncx = builder.create('ncx')
            .att('xml:lang', data.language)
            .att('xmlns', 'http://www.daisy.org/z3986/2005/ncx/')
            .att('version', '2005-1')
            .dec('1.0', 'UTF-8')
            .dtd('-//NISO//DTD ncx 2005-1//EN', 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd')
        .root()
        .e('head')
            .e('meta').att('name', 'dtb:uid').att('content', data.id.value).up()
            .e('meta').att('name', 'dtb:depth').att('content', data.depth).up()
            .e('meta').att('name', 'dtb:totalPageCount').att('content', 0).up()
            .e('meta').att('name', 'dtb:maxPageNumber').att('content', 0).root()

        .e('docTitle')
            .e('text', data.title).root()
        .e(data.navMap);

    return ncx.end({ pretty: true, indent: '  ', newline: '\n' });
};

metafiles.content = (data, directories) => {
    directories = grunt.file.expand(directories.map(dir => dir + '/**'));

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
            .e('meta').att('name', 'cover').att('content', 'cover').up()
            .e('dc:identifier', data.id.value).att('id', 'etextno').att('opf:scheme', data.id.scheme).up();

        if (data.keywords) {
            pkg.e('dc:subject', data.keywords.join(', ')).up();
        }

        if (data.description) {
            pkg.e('dc:subject', data.description).up();
        }

        if (data.authors) {
            data.authors.forEach(author => {
                pkg.e('dc:creator', author.name).att('opf:role', 'aut').att('opf:file-as', author.as).up();
            });
        }
        if (data.contributors) {
            data.contributors.forEach(contributor => {
                pkg.e('dc:contributor', contributor.name).att('opf:file-as', contributor.as).up();
            });
        }

        if (data.editor) {
             pkg.e('dc:contributor', data.editor).att('opf:role', 'edt').up();
        }

        if (data.publisher) {
             pkg.e('dc:publisher', data.publisher).up();
        }

        if (data.license) {
             pkg.e('dc:rights', data.license).up();
        }

        if (data.dates) {
            Object.keys(data.dates).forEach(key => {
                pkg.e('dc:date', data.dates[key]).att('opf-event', key).up();
            });
        }

        // Now it's out of the metadata
        pkg.root();

        // Manifest
        pkg.e(manifest(data, directories));

        // Spine
        pkg.e(spine(data));

        // Guide
        pkg.e(guide(data));
    return pkg.end({ pretty: true, indent: '  ', newline: '\n' });
};

var guide = data => {
    var items = [];
    var hasCover = false;
    var hasToc = false;
    var validTypes = ['cover', 'colophon', 'title-page', 'toc', 'index', 'glossary',
    'acknowledgements', 'bibliography', 'copyright-page', 'dedication', 'epigraph',
    'foreword', 'loi', 'lot', 'notes', 'preface'];

    var parseItems = item => {
        if (validTypes.indexOf(item.name) != -1) {
            var guideItem = {
                reference: {
                    '@type': item.name,
                    '@href': item.name + '.html'
                }
            };

            if (item.name === 'toc') {
                hasToc = true;
            } else if (item.name === 'cover') {
                hasCover = true;
            }

            items.push(guideItem);
        }
    };

    data.outline.frontmatter.forEach(parseItems);

    // First item of the body is the beginning of the text
    items.push({
        reference: {
            '@type': 'text',
            '@href': data.outline.body[0].name + '.html'
        }
    });

    data.outline.backmatter.forEach(parseItems);

    if (! hasCover) {
        grunt.log.writeln('Note, Kindle requires a cover page');
    }

    if (! hasToc) {
        grunt.log.writeln('Note, Kindle requires a Table of Content');
    }

    return {
        'guide': {
            '#list': items
        }
    };
};

var spine = data => {
    var items = [];
    var parseItems = item => {
        var spineItem = {
            itemref: {
                '@idref': item.name
            }
        };

        items.push(spineItem);
        if (item.items) {
            item.items.forEach(item => {
                parseItems(item);
            });
        }
    };

    data.outline.frontmatter.forEach(parseItems);

    // The meat of the stuff
    data.outline.body.forEach(parseItems);

    data.outline.backmatter.forEach(parseItems);
    return {
        'spine': {
            '@toc': 'ncx',
            '#list': items
        }
    };
};

var manifest = (data, directories) => {
    var items = [{
        item: {
            '@id': 'ncx',
            '@href': 'toc.ncx',
            '@media-type': 'application/x-dtbncx+xml'
        }
    }];
    var dirs = directories.filter(item => {
        var object = fs.statSync(item);
        return object.isDirectory();
    });

    var files = directories.filter(item => {
        var object = fs.statSync(item);
        return object.isFile();
    }).forEach(file => {
        var relativePath = file;
        var fileArray;
        var mediaType = mime.lookup(file);

        if (mediaType === 'application/x-dtbncx+xml' || mediaType === 'application/oebps-package+xml') {
            return true;
        }
        dirs.forEach(dir => {
            relativePath = relativePath.replace(dir + '/', '');
        });
        var name = relativePath;
        if (mediaType === 'text/html') {
            mediaType = 'application/xhtml+xml';
            fileArray = name.split('/');
            name = fileArray[fileArray.length-1].replace('.html', '');
        }

        items.push({
            item: {
                '@id': _.slugify(name),
                '@href': relativePath,
                '@media-type': mediaType
            }
        });
    });

    return {
        'manifest': {
            '#list': items
        }
    };
};

var navMap = data => {
    data.depth = 1;
    var playOrder = 0;

    var items = [];

    var parseNavPoint = (item, level) => {
        playOrder += 1;
        var navPoint = {
            navPoint: {
                '@id': item.name,
                '@playOrder': playOrder,
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
            item.items.forEach(item => {
                navPoint.items.push(parseNavPoint(item, level +1));
            });
        }
        data.depth = level;
        return navPoint;
    };

    var navPoint = item => {
        items.push(parseNavPoint(item, 1));
    };

    data.outline.frontmatter.forEach(navPoint);

    // The meat of the stuff
    data.outline.body.forEach(navPoint);

    data.outline.backmatter.forEach(navPoint);

    data.navMap = {
        navMap: {
            '#list': items
        }
    };
    return data;
}
