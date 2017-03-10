'use strict';

var criticalcss = require('criticalcss'),
    cleancss = require('clean-css'),
    Request = require('request'),
    path = require('path'),
    fs = require('fs'),
    tmpDir = require('os').tmpdir(),
    humanizeUrl = require('humanize-url');
  
var SC = function () {};

SC.prototype.run = function(pages, opts) {

    // defaults
    var defaults = {
        // Folder to store cricitalcss
        output: './data/',

        // Request options
        request: {},

        // Clean CSS Options
        minify: false,
        cleancss: {},
        // Critical CSS default options
        width: 1200,
        height: 900,
        forceInclude: [],
        rules: [], // REQUIRED
        buffer: 800*1024,
        ignoreConsole: false,
    }

    var opts = Object.assign(defaults, opts || {});

    var request = Request.defaults(opts.request);

    var now = new Date(),
        _pages = [],
        _output = {},
        _rules = '',
        count = 0,
        cssPath = '',
        currentPage;

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

     function start(pages) {

        console.log( '-- start' );

        _pages = pages;

        cssPath = path.join( tmpDir, humanizeUrl(opts.base) + '.css' )
        console.log( 'cssPath: ' + cssPath );
        
        fs.unlink(cssPath, function(){
            getCss(function(){
                console.log( 'done getCss -> getRules()' );
                getRules();
            });
        });
     }

    function processPages(pages) {

        console.log( '-- processPages' );

        if (typeof pages != 'undefined') {
            _pages = pages
        }

        if (_pages.length) {
            currentPage = _pages.shift();
            processPage();
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

        if (opts.minify) {
            file = file.replace('.css','.min.css');
            var css = new cleancss(opts.cleancss.options).minify(string);
            string = css.styles;
            fs.writeFile(file, string, function (err) {
                if (err) return showError(err);
            });
        }

        console.log( 'All Done: file saved as '+ file );
    }

    function cleanCss(source) {
        var options = { /* options */ };
        // retur 
    }

    function processPage() {
        console.log( 'cssPath: ' + cssPath );
        findCritical();
    }

    function getCss(callback) {

        console.log( '-- getCss' );

        var cssUrl = opts.cssUrls.shift();
        if (typeof cssUrl == 'undefined') {
            return callback();
        }
        console.log( 'get: ' + cssUrl );

        request(cssUrl)
            .pipe(fs.createWriteStream(cssPath,{'flags':'a'}))
            .on('close', function(){
                getCss(callback);
            });

    }

    function getRules() {

        console.log( '--getRules' );

        criticalcss.getRules(cssPath, function(err, output) {
            if (err) {
                throw new Error(err);
            } else {
                _rules = JSON.parse(output);
                console.log( 'done getRules -> processPages()' );
                processPages();
            }
        });
    }

    function findCritical(output) {

        console.log( '-- findCritical' );
        
        var fullUrl = opts.base + currentPage.url;
        console.log( 'open page: ' + fullUrl );
        
        criticalcss.findCritical(fullUrl, { rules: _rules }, function(err, output) {
            if (err) {
                throw new Error(err);
            } else {
                writeFile(currentPage.filename, output);
                processPages();
            }
        });
    }

    return start(pages);

}

module.exports = new SC();