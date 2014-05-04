This plugin requires Grunt `{%= peerDependencies.grunt %}`

If you haven't used [Grunt][grunt] before, be sure to check out the [Getting Started][Getting Started] guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install {%= name %} --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('{%= name %}');
```

## Required config
This is a plugin that requires a fairly large metadata file using a very
distinct look. It should be set (at least) as the option `meta`. As long
as it contains the following keys, it can also hold other metadata as
the user needs it.

The example is from my own writing.

```js
{
    "author": {
        "as": "Hogebrandt, Marie",
        "name": "Marie Hogebrandt"
    },
    "date": "2014-03-21T09:44:33Z",
    "files": [
        {
            "href": "toc.ncx",
            "name": "ncx",
            "type": "application/x-dtbnc+xml"
        },
        {
            "href": "styles/epub.css",
            "name": "style",
            "type": "text/css"
        },
        {
            "href": "images/cover.jpg",
            "name": "cover-image",
            "type": "image/jpeg"
        }
    ],
    "keywords": [
        "Urban Fantasy",
        "Svensk folktro"
    ],
    "language": "sv",
    "license": null,
    "pages": {
        "colophon": {
            "href": "colophon.html",
            "title": "Kolofon"
        },
        "cover": {
            "href": "cover.html",
            "title": "Framsida"
        },
        "title-page": {
            "href": "title.html",
            "title": "Titelsida"
        },
        "toc": {
            "href": "content.html",
            "title": "Inneh\u00e5ll"
        }
    },
    "publisher": null,
    "outline": [
        {
            "id": 2,
            "name": "akt-01",
            "items": [
                {
                    "id": 3,
                    "name": "kapitel-01",
                    "title": "Kapitel 1"
                }
            ],
            "title": "Akt I: Konsten att F\u00f6rf\u00f6ra"
        },
        {
            "id": 10,
            "name": "akt-02",
            "items": [
                {
                    "id": 11,
                    "name": "kapitel-06",
                    "title": "Kapitel 6"
                }
            ],
            "title": "Akt II: Konsten att F\u00f6rf\u00f6lja"
        },
        {
            "id": 18,
            "name": "akt-03",
            "items": [
                {
                    "id": 19,
                    "name": "kapitel-11",
                    "title": "Kapitel 12"
                }
            ],
            "title": "Akt III: Konsten att F\u00f6rg\u00f6ra"
        }
    ],
    "spine": {
        "backmatter": [
            {
                "id": 27,
                "name": "colophon",
                "title": "Kolophon"
            }
        ],
        "frontmatter": [
            {
                "id": 1,
                "name": "cover",
                "title": "Framsida"
            }
        ]
    },
    "title": "Sk\u00e4rvor av det f\u00f6rg\u00e5ngna",
    "uid": "skarvor-av-det-forgangna2014-03-21-09-44-33-012690"
}

```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
