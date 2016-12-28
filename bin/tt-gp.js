#!/usr/bin/env node

var cp = require( 'child_process' );
var path = require( 'path' );
var fs = require( 'fs' );
var wbDir = __dirname;

var wbNodeModulesPath = path.resolve( wbDir, '../node_modules' );

require( '../common/createSoft' );

cp.fork(
    path.join( wbNodeModulesPath, '/gulp/bin/gulp.js' ),
    process.argv.slice( 2 )
);