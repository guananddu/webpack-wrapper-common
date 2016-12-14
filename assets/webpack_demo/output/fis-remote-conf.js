/**
 * remote
 * by guananddu@qq.com
 */
// fis3b release username -w
module.exports = {
    'username' : {
        receiver: 'http://ip:port/receiver',
        deploy: {
            // 静态资源
            '*': '/path/2/resource',
            // 模板
            '*.html': '/path/2/template'
        }
    }
};
