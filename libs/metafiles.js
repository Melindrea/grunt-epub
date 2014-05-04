/*
 * toc
 * https://github.com/Melindrea/grunt-epub/libs/toc
 *
 * Copyright (c) 2014 Marie Hogebrandt
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
mustache = require('mustache'),
grunt = require('grunt'),
builder = require('xmlbuilder');

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
