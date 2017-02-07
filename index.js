'use strict';

var criticalcss = require('criticalcss'),
    cleancss = require('clean-css'),
    request = require('request'),
    path = require('path'),
    fs = require('fs'),
    tmpDir = require('os').tmpdir();


 
var SC = function () {};

SC.prototype.run = function(pages, opts) {

    // defaults
    var defaults = {
        // Folder to store cricitalcss
        output: './data/',

        // Clean CSS
        clean: false,

        // Critical CSS default options
        width: 1200,
        height: 900,
        forceInclude: [],
        rules: [], // REQUIRED
        buffer: 800*1024,
        ignoreConsole: false,
    }

    var opts = Object.assign(defaults, opts || {});

    var now = new Date(),
        _pages = [],
        _output = {},
        count = 0;

    function showError(err) {
        console.error('Error: ', err );
        return;
    }

     // cssmin: {
     //        target: {
     //            files: [{
     //                expand: true,
     //                cwd: 'assets/css/critical',
     //                src: ['*.css', '!*.min.css'],
     //                dest: 'assets/css/critical',
     //                ext: '.min.css'
     //            }]
     //        }
     //    }



    function processArray(pages) {
        if (typeof pages != 'undefined') {
            _pages = pages
        }

        if (_pages.length) {
            var page = _pages.shift();
            //console.log( item );
            processPage(page);
        } else {
            console.log( 'Done' );
            //writeFile(JSON.stringify(_output));
        }
    }

    function writeFile(file, string) {
        var file =  opts.output + file;

        fs.writeFile(file, string, function (err) {
            if (err) return showError(err);
        });

        console.log( 'All Done: file saved as '+ file );
    }

    function processPage(page) {
        console.log( 'open page: ' + page.url );

        var cssUrl = opts.cssUrl;
        var cssPath = path.join( tmpDir, page.filename );

        request(cssUrl).pipe(fs.createWriteStream(cssPath)).on('close', function() {
            criticalcss.getRules(cssPath, function(err, output) {
                if (err) {
                    throw new Error(err);
                } else {
                    criticalcss.findCritical(page.url, { rules: JSON.parse(output) }, function(err, output) {
                        if (err) {
                            throw new Error(err);
                        } else {
                            writeFile(page.filename, output);
                            processArray();
                        }
                    });
                }
            });
        });

    }

    return processArray(pages);

}

module.exports = new SC();