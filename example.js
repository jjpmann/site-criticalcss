var sc = require('./index.js');

var options = {
    cssUrl: 'https://s1.wp.com/home.logged-out/page-rey/css/styles.css?v=1486463209'
}

var _base = 'https://wordpress.com/';


var pages = [
    {
        url: _base,
        filename: 'critical-home.css',
        opts: {
            // overrides only
        }
    }
]

sc.run(pages, options);

