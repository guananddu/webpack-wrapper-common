var cp = require( 'child_process' );
var path = require( 'path' );
var fs = require( 'fs' );
var wbDir = __dirname;
var workDir = process.cwd();

var wbNodeModulesPath = path.resolve( wbDir, '../node_modules/*' );
var workDirModulesPath = path.resolve( workDir, 'node_modules/' );

// create node_modules soft link
if (fs.existsSync( workDirModulesPath ) ) {
    cp.exec( `ln -s ${wbNodeModulesPath} ${workDirModulesPath}` );
} else {
    cp.exec( `mkdir ${workDir}/node_modules && ln -s ${wbNodeModulesPath} ${workDirModulesPath}` )
}