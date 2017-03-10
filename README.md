# site-criticalcss

> Runs Critical CSS for your site

## Install

```
$ npm install --save site-criticalcss
```

## Usage

```js
var sc = require('site-criticalcss');

var options = {
    cssUrl: 'https://s1.wp.com/home.logged-out/page-rey/css/styles.css'
}

var _base = 'https://wordpress.com/';

var pages = [
    {
        url: _base,
        filename: 'critical-home.css',
    }
]

sc.run(pages, options);
```

## CLI

```
$ npm install --global site-criticalcss
```

## ToDo

- Make it work with some basic settings