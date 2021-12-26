/**
 * 描述: 程序入口文件
*/

const express = require('express'); // 引入express模块
const routes = require('./routes'); //导入自定义路由文件，创建模块化路由
const app = express();
const port = process.env.PORT || 3000;

app.use('/', routes);
// app.listen(port, '0.0.0.0', () => { // 监听3000端口
app.listen(port, () => { // 监听3000端口
	console.log('服务已启动 http://localhost:'+port);
})


