#!/usr/bin/env node

var cp = require( 'child_process' );
var path = require( 'path' );
var fs = require( 'fs' );
var shell = require( 'shelljs' );
var argv = require( 'minimist' )( process.argv.slice( 2 ) );
var download = require( 'download-git-repo' );
var ora = require( 'ora' );

var wbDir = __dirname;
var workDir = process.cwd();


// 检查是不是查看版本号
if ( argv[ 'V' ] ) {
    var version = require( '../package.json' ).version;
    console.log( `webpack-wrapper-common: ${version}` );
    return;
}

if( ~ argv[ '_' ].indexOf( 'init' ) ) {

    var params = argv[ '_' ];

    if(params.length == 1) {

        var targetDir = path.resolve( __dirname, '..', 'assets/webpack_demo' );
        shell.cp( '-rf', `${targetDir}/*`, workDir );

        // 直接写入文件
        fs.writeFileSync( `${workDir}/.gitignore`, [
            'node_modules',
            'dev_modules',
            'bower_components'
        ].join( '\n' ) );

        fs.writeFileSync( `${workDir}/output/.gitignore`, [
            'page',
            'static',
            'template',
            'resource'
        ].join( '\n' ) );

        console.log( 'Assets created.' );

        return
    }
    // load from github
    if(params.length > 1) {
        var spinner = ora(`Start loading template from ${params[1]}`);
        spinner.start();
        download(params[1], workDir, function(err) {
            if (err) {
                console.log(err)
                spinner.text = 'template fail to load';
                spinner.fail();
                return;
            }
            spinner.text = 'template load success';
            spinner.succeed();
        });
        return
    }
}

var wbNodeModulesPath = path.resolve( wbDir, '../node_modules' );

require( '../common/createSoft' );

cp.fork(
    path.join( wbNodeModulesPath, '/webpack/bin/webpack.js' ),
    process.argv.slice( 2 )
);