const express = require('express');
const router = express.Router(); // 注册路由 

// 引入路由模块
const api = require('../api');

router.get('/iciba', api.iciba_single);
router.get('/shanbay', api.shanbay_single);
router.get('/youdao', api.youdao_single);

module.exports = router;