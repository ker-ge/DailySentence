const schedule = require('../tools/schedule');
const config = require('../config');
const shell = require("shelljs");  // 执行shell操作
// 定时获取新闻热搜
const apiArr = require('../api');

schedule.setSchedule(config.autoGetDate, async function () {
  console.log('====================开始执行获取数据====================', new Date());
  // 获取新闻热搜
  for (const key in apiArr) {
    await apiArr[key]();
  }
  console.log('====================结束执行获取数据====================', new Date());
});

schedule.setSchedule(config.autoPushDate, async function () {
  let commit = new Date();
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