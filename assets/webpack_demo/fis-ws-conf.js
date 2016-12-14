/**
 * ws配置文件
 */

var path = require( 'path' );

// 当前文件夹路径【无需修改】
var webContent = __dirname;

module.exports = {

    // webserver的端口号
    webPort: '8081',

    // webserver的项目根目录【一般不需修改】，即为当前`pwd`的目录
    webContent: webContent,

    // 模板引擎根目录【只需要修改最后一个参数即可】
    templates: path.join( webContent, '.' ),

    // 模板引擎切换: smarty / django / velocity / freemarker [ 默认velocity ]
    /**
     * velocity模板引擎采用：
     * https://www.npmjs.com/package/velocity
     *
     * django模板引擎采用'A wrapper of Django's template engine'方式（桥接原理）
     * 详见：https://www.npmjs.com/package/django
     * 在启用之前请确保python环境已经ready，然后安装django:
     * # pip install -v Django==1.7
     * //or
     * # easy_install "Django==1.7"
     *
     * smarty模板引擎采用：
     * https://www.npmjs.com/package/nsmarty
     *
     * freemarker模板引擎采用：（桥接原理）
     * 在启用之前，请确保java环境，并且需要安装：http://fmpp.sourceforge.net/
     * https://www.npmjs.com/package/freemarker.js#readme
     */
    tplEngine: 'django',

    // 反向代理配置【按需配置】，键名可以随意，只要是每一个的匹配规则
    reverseProxyMap: {

        tpl: {
            pattern: /^\/custom\//,
            replace: '/tpl/custom/'
        }

    },

    // mock 相关配置【一般不需修改】
    mockCommon: 'commonmock/common.js', // 此项会拼接下面的两个前缀路径
    mockTemplate: path.join( webContent, 'mock/html' ),
    mockAjax: path.join( webContent, 'mock/ajax' ),

    /**
     * web server 中间层
     * requester 是一个请求器，可以用来做反向代理等等
     * 
     * @param  {Object} connect
     * @param  {Object} options
     * @param  {Array}  middlewares 系统中间层
     * @param  {Object} rtool       
     * { 
     *     requester: 请求器, 
     *     defaulthostp: '默认的本地域名' 
     * }
     * @return {Array}  中间层数组
     */
    middlewares: function( connect, options, middlewares, rtool ) {

        // how to inject a custom middleware into the array of default 
        // middlewares
        // 
        // html middlewares example:
        // 
        // middlewares.unshift( function( req, res, next ) {
        //     if ( utils.isHtml( req ) )
        //         return handlerHtml.run( req, res, next, config );
        //     return next();
        // } );

        middlewares.unshift( function( req, res, next ) {
            // 这是一个可以自定义的中间层
            console.log( 'user middleware, request url: ' + req.url );
            return next();
        } );

        // 如果需要请求对应的线上数据或者其他域的数据，可以使用 requester 来请求
        // requester的使用参见：
        // https://www.npmjs.org/package/request
        // console.log( rtool.requester, rtool.defaulthostp );

        return middlewares;

    },

};