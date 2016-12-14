/**
 * config
 * by guananddu@qq.com
 */

module.exports = {

    api: {
        auth: '/postpath'
    },

    authFormConfig: {
        rules: {
            uid: 'required',
            username: 'required',
            authdoc: 'required',
            'auth-classify-sel-l1': 'checkCls1and2',
            'auth-classify-sel-l2': 'checkCls1and2',
            'auth-reason': 'required'
        },
        messages: {
            uid: '少填了东西',
            username: '少填了东西',
            authdoc: '少填了东西',
            'auth-classify-sel-l1': '少填了东西',
            'auth-classify-sel-l2': '少填了东西',
            'auth-reason': '少填了东西'
        }
    }

};