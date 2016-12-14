/**
 * 【此文件只用来向远程服务器发送文件】
 * by guananddu@qq.com
 */

var path = require( 'path' );
var projectName = path.parse( path.join( __dirname, '..' ) ).name;

fis.set( 'project.dependencies', [ ], [ ] );

fis.match( '*', {
    useHash: false,
    domain: null,
    optimizer: null,
    release: projectName + '/$0'
}, true );

fis.set( 'project.ignore', [
    'fis-conf.js',
    'fis-remote-conf.js'
] );
