const cp = require( 'child_process' );
const path = require( 'path' );
const fs = require( 'fs' );
const wbDir = __dirname;

const wbNodeModulesPath = path.resolve( wbDir, '../node_modules' );

require( '../common/createSoft' );

cp.fork(
    path.join( wbNodeModulesPath, '/gulp/bin/gulp.js' ),
    process.argv.slice( 2 )
);