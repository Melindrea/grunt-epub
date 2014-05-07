### epub
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

### epubCheck

```js
epubCheck: {
    all: {
        files: {
          all: ['epub/default.epub']
        }
    }
}
```
