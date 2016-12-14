const path = require( 'path' );
const readdir = require( 'readdir' );

const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlwebpackPlugin = require( 'html-webpack-plugin' );
const WebpackMd5Hash = require( 'webpack-md5-hash' );
const ResolverPlugin = webpack.ResolverPlugin;
const DirectoryDescriptionFilePlugin = webpack.ResolverPlugin.DirectoryDescriptionFilePlugin;
const ProvidePlugin = webpack.ProvidePlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const DefinePlugin = webpack.DefinePlugin;
const HtmlResWebpackPlugin = require( 'html-res-replace-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin-hash' );

///////////////////////////////////以下为配置项///////////////////////////////////

// 当前项目名称
const projectName = path.parse( __dirname ).name;
// 源代码模板目录
const tplPath  = path.resolve( __dirname, 'page' );
// 默认产出目录
const outputDir = 'output';

// local模式产出目录配置
const localStaticPath = path.join( outputDir, 'static/' );
const localTplPath    = path.join( outputDir, 'page/' );

// online模式产出目录配置
const prefixOnlineStaticPath = path.join( 'resource', projectName );
const prefixOnlineTplPath    = path.join( 'template', projectName );
const onlineStaticPath = path.join( outputDir, prefixOnlineStaticPath );
const onlineTplPath    = path.join( outputDir, prefixOnlineTplPath );

// 判断运行模式
let envState = process.env.NODE_ENV;
let isLocal = envState === 'local';
let isOnline = envState === 'online';

// 域名设置
let domainsConfig = [ 
    '//s3.pstatp.com/toutiao',
    '//s3a.pstatp.com/toutiao',
    '//s3b.pstatp.com/toutiao'
];

// hash 设置
let hashConfig = {
    chunkhash: '[chunkhash:8]',
    hash: '[hash:8]',
    contenthash: '[contenthash:8]'
};

// css 导出设置
let cssExportConfig = '[name].' + hashConfig.chunkhash + '.css';
// js 导出设置
let jsExportConfig = '[name].' + hashConfig.chunkhash + '.js';

// webpack 打包入口设置
let entryConfig = {
    auth: './script/auth/main.js',
    // vendor
    vendor: [ 
        'jquery', 'jquery-validation', 'bootstrap'
    ],
    react: [
        'react', 'react-router', 'react-dom' 
    ]
};

// vendor 设置
let commonChunks = [
    {
        name: 'vendor',
        filename: 'vendor.' + hashConfig.chunkhash + '.js'
    }
];

// 对全局暴露的变量
let providerConfig = {
    $: 'jquery',
    jQuery: 'jquery'
};

///////////////////////////////下方配置一般无需修改////////////////////////////////////

// 产出目录
const outputPaths = {
    local: {
        static: localStaticPath,
        tpl: localTplPath,
        absoStatic: path.resolve( localStaticPath ),
        absoTpl: path.resolve( localTplPath )
    },
    online: {
        static: onlineStaticPath,
        tpl: onlineTplPath,
        absoStatic: path.resolve( onlineStaticPath ),
        absoTpl: path.resolve( onlineTplPath )
    }
};

// 项目导出配置
let outputConfig = {
    path: './' + outputPaths[ envState ].static,
    filename: jsExportConfig,
    chunkFilename: 'chunk/[name]' + hashConfig.chunkhash + '.js'
};

// 本地开发模式
if ( isLocal ) {
    outputConfig.publicPath = '/' + outputPaths[ envState ].static;
}

// html replacement
let replacementsArr = [
    {
        search: /\[tplroot\]/g,
        replace: isLocal ? outputDir : prefixOnlineTplPath
    }
];

// 插件列表
let plugins = [
    // 占位符替换
    // new DefinePlugin( defineConfig ),
    // 对bower_components中模块的支持
    new ResolverPlugin( 
        [ new DirectoryDescriptionFilePlugin( 'bower.json', [ 'main' ] ) ], 
        [ 'normal', 'loader' ] 
    ),
    new ProvidePlugin( providerConfig ),
    new ExtractTextPlugin( cssExportConfig )
];

// pushing page handler
( () => {
    let afterfix = path.parse( tplPath ).name;
    let results  = readdir.readSync( tplPath, [ '**.html' ] );
    results.map( el => {
        plugins.push(
            new HtmlResWebpackPlugin( {
                mode: 'html',
                filename: path.join(
                    '../..', 
                    isLocal ? localTplPath : prefixOnlineTplPath, 
                    el 
                ),
                template: path.join( afterfix, el ),
                htmlMinify: null,
                replace: replacementsArr
            } )
        );
    } );
} )();

// pushing commonschunkplugins
commonChunks.forEach( ( el, inx ) => {
    plugins.push( new CommonsChunkPlugin( el ) );
} );

// 上线模式
if ( isOnline ) {
    // 上线压缩
    plugins.push( new UglifyJsPlugin( {
        compress: { warnings: false }
    } ) );
    // 每一次上线随机取一个域名
    outputConfig.publicPath = [ 
            domainsConfig[ Math.random() * 3 | 0 ], 
            '/', 
            prefixOnlineStaticPath,
            '/'
        ].join( '' );
}

module.exports = {
    devtool: isLocal ? '#source-map' : false,
    entry: entryConfig,
    output: outputConfig,
    plugins: plugins,
    // 可使用postcss
    postcss: webpack => {
        return [
            require( 'postcss-import' )( { addDependencyTo: webpack } ),
            require( 'postcss-url' )(),
            require( 'precss' )(),
            require( 'postcss-cssnext' )(),
            require( 'postcss-browser-reporter' )(),
            require( 'postcss-reporter' )()
        ]
    },
    module: {
        preLoaders: [ ],
        loaders: [
            {
                test: /\.(js|jsx|es6)?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    'style-loader', 'css-loader?minimize', 'less-loader?strictMath&noIeCompat'
                )
            },
            {
                test: /\.scss$/,
                loaders: ExtractTextPlugin.extract(
                    'style-loader', 'css-loader?minimize', 'sass-loader'
                )
            },
            // for postcss
            // {
            //     test: /\.css$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: ExtractTextPlugin.extract(
            //         'style-loader', 'css-loader?minimize', 'postcss-loader'
            //     )
            // },
            {
                test: /\.jpg$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/, 
                loader: 'url-loader?limit=5000' 
            }
        ]
    },
    resolve: {
        extensions: [ '', '.js', '.jsx', '.json', '.tsx', '.ts', '.es6','.vue' ],
        modulesDirectories: [ 'node_modules', 'bower_components' ]
    },
    // 服务器配置【因为使用django template模板，所以服务器建议使用fis3b】
    // devServer: {
    //     historyApiFallback: true,
    //     hot: true,
    //     inline: true,
    //     progress: true,
    //     color: true,
    //     port: 8003,
    //     host: '0.0.0.0',
    //     contentBase: './output',
    //     // html请求被fis3b ws代理来解析 html
    //     proxy: {
    //         '/mock/*': {
    //             target: 'http://127.0.0.1:8005',
    //             secure: false,
    //         }
    //     }
    // }
};






