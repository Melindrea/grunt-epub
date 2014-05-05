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
    "keywords": [
        "Urban Fantasy",
        "Svensk folktro"
    ],
    "language": "sv",
    "license": null,
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

## File Naming
Files that are part of the spine/table of contents need to have a filename
based on their `name`, as that ties everything together. If it's in the
spine or outline, the `name` set there *must* inform the filename, ex:

The cover has the `name` cover in spine/frontmatter. This means the
filename needs to be `cover.html`, or the automatic recognition of files
in the manifest will not work.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
