## 开发规范

- 前端组件使用 `bower install xxx --save` 来安装
- `custom_modules` 为自定义模块包路径
- `mock` 仍旧为模拟数据路径
- `output` 为默认的资源产出路径
- `page` 为默认的 `html` 模板路径
- `script` 为 `js/es6/jsx` 等脚本路径
- `shell` 为部分工具 `shell` 命令
- `static` 可以放置图片等资源
- `style` 为样式文件路径

## 本地调试

进入项目根目录：

`npm run watch`

`npm run fisws`

会自动打开浏览器，进入 `output` 中寻找对应的模板即可调试

## 发布到远程

因为 `webpack` 暂无发布至远程代码的插件，故仍旧复用 `fis3b`：

`npm run watch`

`cd output`

`fis3b release username`

相关配置在 `output/fis-remote-conf.js`