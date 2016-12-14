#!/usr/bin/env node

const cp = require( 'child_process' );
const path = require( 'path' );
const fs = require( 'fs' );
const shell = require( 'shelljs' );

const wbDir = __dirname;
const argv  = process.argv;
const workDir = process.cwd();

// 检查是不是要初始化项目
if ( argv.length === 3 && argv[ 2 ] === 'init' ) {
    console.log( 'Creating assets...' );
    let targetDir = path.resolve( __dirname, '..', 'assets/webpack_demo' );
    shell.cp( '-rf', `${targetDir}/*`, workDir );
    console.log( 'Assets created.' );
    return;
}

const wbNodeModulesPath = path.resolve( wbDir, '../node_modules' );

require( '../common/createSoft' );

cp.fork(
    path.join( wbNodeModulesPath, '/webpack/bin/webpack.js' ),
    process.argv.slice( 2 )
);