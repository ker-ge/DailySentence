const schedule = require('../tools/schedule');
const config = require('../config');
const shell = require("shelljs");  // 执行shell操作
const moment = require('moment');
// 定时获取新闻热搜
const apiArr = require('../api');
const { readmeTemplate, readFileSync, writeFileSync } = require('../tools/common');

schedule.setSchedule(config.autoGetDate, async function () {
  console.log('====================开始执行获取数据====================', moment().format('YYYY-MM-DD'));
  let resAarr = [];
  // 获取新闻热搜
  for (const key in apiArr) {
    resAarr.push(await apiArr[key]());
  }
  // 开始修改readme文件
  let readmeStr = readmeTemplate() + moment().format('YYYY-MM-DD') + '已更新 \n';
  readmeStr += '```\n';
  resAarr.forEach(res => {
    readmeStr += `* ${res[0]}\n  > ${res[1]}\n  > ${res[2]}\n\n`;
  });
  readmeStr += '```\n';
  writeFileSync('./README.md', readmeStr);
  console.log('====================结束执行获取数据====================', moment().format('YYYY-MM-DD'));
});

schedule.setSchedule(config.autoPushDate, async function () {
  let commit = moment().format('YYYY-MM-DD');
  console.log('====================开始执行自动push代码====================', commit);

  // // 执行git拉取命令
  // shell.exec(`git pull`);

  // 执行git暂存命令
  shell.exec('git add .');

  // 执行git提交命令
  shell.exec(`git commit -m "${commit}"`);

  // 执行git push命令
  shell.exec('git push');
  console.log('====================结束执行自动push代码====================', commit);
})