# grunt-epub [![NPM version](https://badge.fury.io/js/grunt-epub.png)](http://badge.fury.io/js/grunt-epub) 

> Creates epub from specified files

## Table of Contents
* [Getting Started](#getting-started)
* [Options](#options)
* [Tasks](#tasks)
* [Usage Examples](#usage-examples)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)


## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt][grunt] before, be sure to check out the [Getting Started][Getting Started] guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-epub --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-epub');
```

### Required config
This is a plugin that requires a fairly large metadata file using a very
distinct look. It should be set (at least) as the option `meta`. As long
as it contains the following keys, it can also hold other metadata as
the user needs it.

The example is from my own writing. I have added comments to explain each part, but as it's a JSON file that is not valid.

```js
{
    // List of authors. Authors, contributors and editor all
    // follow the convention of having a "as" and a "name"
    "authors": [{
        "as": "Hogebrandt, Marie",
        "name": "Marie Hogebrandt"
    }],
    "contributors": [],
    "editor": null,

    // Exact names of the dates depends a little bit. Kindle requires
    // the dates to be in YYYY-MM-DD form (though may be only YYYY)
    // Overall, add dates that's relevant, like publishing, digital
    // publishing, etc.
    "dates": {
        "original-publication": "2014-03-21T09:44:33Z",
        "opf-publication": "2014-03-21T09:44:33Z"
    },

    // These are made into a single, comma-delimited list for a Subject
    "keywords": [
        "Urban Fantasy",
        "Svensk folktro"
    ],
    "language": "sv",
    "license": null,

    // A normal string, either publishing house or your own name
    "publisher": null,

    // The outline is very important, since that sets all the guides,
    // spine, etc. Each of the lists needs to have a proper order, but
    // the three keys (body, frontmatter, backmatter) do not.
    // The "name" is required to correspond to the name of the HTML file,
    // E.G, akt-01.html
    "outline": {
        // Items in the body can be nested deeper than 1 level, if they
        // should be nested in navigation
        "body": [
            {
                "name": "akt-01",
                "items": [
                    {
                        "name": "kapitel-01",
                        "title": "Kapitel 1"
                    },
                    {
                        "name": "mellanspel-01",
                        "title": "Mellanspel"
                    },
                    {
                        "name": "kapitel-02",
                        "title": "Kapitel 2"
                    },
                    {
                        "name": "kapitel-03",
                        "title": "Kapitel 3"
                    },
                    {
                        "name": "mellanspel-02",
                        "title": "Mellanspel"
                    },
                    {
                        "name": "kapitel-04",
                        "title": "Kapitel 4"
                    },
                    {
                        "name": "kapitel-05",
                        "title": "Kapitel 5"
                    }
                ],
                "title": "Akt I: Konsten att F\u00f6rf\u00f6ra"
            },
            {
                "name": "akt-02",
                "items": [
                    {
                        "name": "kapitel-06",
                        "title": "Kapitel 6"
                    },
                    {
                        "name": "mellanspel-03",
                        "title": "Mellanspel"
                    },
                    {
                        "name": "kapitel-07",
                        "title": "Kapitel 7"
                    },
                    {
                        "name": "kapitel-08",
                        "title": "Kapitel 8"
                    },
                    {
                        "name": "mellanspel-04",
                        "title": "Mellanspel"
                    },
                    {
                        "name": "kapitel-09",
                        "title": "Kapitel 9"
                    },
                    {
                        "name": "kapitel-10",
                        "title": "Kapitel 10"
                    }
                ],
                "title": "Akt II: Konsten att F\u00f6rf\u00f6lja"
            },
            {
                "name": "akt-03",
                "items": [
                    {
                        "name": "kapitel-11",
                        "title": "Kapitel 12"
                    },
                    {
                        "name": "mellanspel-05",
                        "title": "Mellanspel"
                    },
                    {
                        "name": "kapitel-12",
                        "title": "Kapitel 12"
                    },
                    {
                        "name": "kapitel-13",
                        "title": "Kapitel 13"
                    },
                    {
                        "name": "kapitel-14",
                        "title": "Kapitel 14"
                    },
                    {
                        "name": "mellanspel-06",
                        "title": "Mellanspel"
                    },
                    {
                        "name": "kapitel-15",
                        "title": "Kapitel 15"
                    },
                    {
                        "name": "epilog",
                        "title": "Epilog"
                    }
                ],
                "title": "Akt III: Konsten att F\u00f6rg\u00f6ra"
            }
        ],
        // For both front- and backmatter, the name needs to be one of
        // the following:
        // cover, colophon, title-page, toc, index, glossary,
        // acknowledgements, bibliography, copyright-page,
        // dedication, epigraph, foreword, loi, lot, notes,
        // preface.
        // toc = Table of contents, loi = List of Illustrations,
        // lot = List of Tables.
        // These are used in the Guide to map files to landmarks.
        // Kindle requires a cover and a toc

        // Anything that goes at the end of the novel.
        "backmatter": [
            {
                "name": "colophon",
                "title": "Kolophon"
            }
        ],

        // Anything that goes at the front of the novel
        "frontmatter": [
            {
                "name": "cover",
                "title": "Framsida"
            }
        ]
    },
    "title": "Sk\u00e4rvor av det f\u00f6rg\u00e5ngna",

    // A unique identifier. This can be almost anything, recommended is
    // ISBN, or URI or similar. The scheme is non-standard, but
    // recommended to match what kind of identifier
    "id": {
        "value": "skarvor-av-det-forgangna2014-03-21-09-44-33-012690",
        "scheme": "UUID"
    },
    "description": "Some description ..."
}
```

### File Naming
The strict naming is for the manifest. The HTML files need a unique ID
that ties together the different guides/spines/etc with the automatically
generated Manifest, which lists all files in the EPUB. Currently all
HTML files are assumed to be stored in the root directory of the EPUB.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md


## Options
#### Epub

##### dest
Type: `String`
Default: `epub`

Folder (based on the root of the project) where the EPUB will
be generated.

##### meta
Type: `Object`
Default: `{}`

The metadata of dates, authors, etc. Fault tolerant, but inaccurate data will lead to inaccurate metafiles.


## Tasks
Two tasks are associated with this plugin:

#### epub
The core task, which takes the filename to create and which folder(s) to fetch the files from.

#### epubCheck
A wrapper around the Java library EPUB check. The library is included, but obviously Java needs to be installed


## Usage Examples
#### epub
Assume the filename is `default.epub`, and that the files are stored in `files`. The meta is assumed to be stored in the root as `config.js`

Default options, will save it as `epub/default.epub`

```js
epub: {
      options: {
        meta: require('./config')
      },
      default: {
        files: {
          'default': ['files']
        }
    }
}
```

Custom options, saves it as `custom/default.epub`

```js
epub: {
      options: {
        meta: require('./config')
      },
      default: {
        options: {
            dest: 'custom'
        },
        files: {
          'default': ['files']
        }
    }
}
```

Two different books, with different metas

```js
epub: {
      book1: {
        options: {
            meta: require('./config')
        },
        files: {
          book1: ['files']
        }
    },
    book2: {
        options: {
            meta: require('./config2')
        },
        files: {
          book2: ['files2']
        }
    }
}
```

#### epubCheck

```js
epubCheck: {
    all: {
        files: {
          all: ['epub/default.epub']
        }
    }
}
```


## Contributing
We welcome all kinds of contributions! The most basic way to show your support is to star the project, or to raise issues.

## Author

**Marie Hogebrandt**

+ [github.com/Melindrea](https://github.com/Melindrea)
+ [twitter.com/melindrea82](http://twitter.com/melindrea82)
+ [http://mariehogebrandt.se](http://mariehogebrandt.se)

## License
Copyright (c) 2014 Marie Hogebrandt, contributors.  
Released under the MIT license

**DATE**       **VERSION**   **CHANGES**                                                                
* 2014-05-07   v0.3.2        Refactor outline,New docs with examples,Remove grunt-verb until [this      
                             bug](https://github.com/assemble/grunt-verb/issues/1) is solved `verb` ran 
                             at the terminal instead                                                    
* 2014-05-06   v0.3.1        Create guide from frontmatter and backmatter                               
* 2014-05-05   v0.3.0        Creates the content.opf from metadata, with the exception of the (optional)
                             guide                                                                      
* 2014-05-04   v0.2.0        Creates the toc.ncx from metadata                                          
* 2014-05-03   v0.1.0        will create a valid epub, assuming all files (except                       
                             `META-INF/container.xml` and `mimetype`) are created through other means   

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on May 07, 2014._
