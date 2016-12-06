const cp = require( 'child_process' );
const path = require( 'path' );
const fs = require( 'fs' );
const wbDir = __dirname;
const workDir = process.cwd();

const wbNodeModulesPath = path.resolve( wbDir, '../node_modules' );
const workDirModulesPath = path.resolve( workDir, 'node_modules' );

// create node_modules soft link
! fs.existsSync( workDirModulesPath )
    && cp.exec( `ln -s ${wbNodeModulesPath} ${workDirModulesPath}` );