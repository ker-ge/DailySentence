/**
 * 获取有道词典每日一句历史数据
 * https://dict.youdao.com/infoline?mode=publish&date=2021-03-15&update=auto&apiversion=6.0
 */

const axios = require('axios');
const fs = require('fs'); // 文件操作
const moment = require('moment');
const path = require('path');
const appPath = path.resolve('.');
const { getEveryDay } = require('../tools/common');
const reqUrl = 'https://dict.youdao.com/infoline?mode=publish&date=';
const yArr = ['2021'];
const mArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const startDate = '2021-03-01';
const savePath = appPath + '/data/youdao/';
const txtFile = savePath + 'youdao.txt';
// 等待毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});
// 整理获取所有日期的url
function getAllDayUrl() {
    let daysUrlArr = [];
    let days = getEveryDay(yArr, mArr, startDate);
    for (let i = 0; i < days.length; i++) {
        // 按时间分组
        let g_date = days[i].substr(0, 7);
        if (!daysUrlArr[g_date]) {
            daysUrlArr[g_date] = [];
        }
        daysUrlArr[g_date].push(reqUrl + days[i] + '&update=auto&apiversion=6.0');
    }
    return daysUrlArr;
}
// 请求所有的
function sendAllReq(urlArr) {
    let reqArr = [];
    for (let i = 0; i < urlArr.length; i++) {
        reqArr.push(axios.get(urlArr[i]));
    }
    return reqArr;
}
// 处理所有返回的
function processAllRes(reqUrlArr, resArr) {
    let dataArr = [];
    for (let i = 0; i < resArr.length; i++) {
        for (let j = 0; j < reqUrlArr.length; j++) {
            let d_date = reqUrlArr[j].substr(51, 10);
            let d_dateStr = d_date.replace(/-/g, '') + '0000';
            if (resArr[i].data[d_date]) {
                let resdata = resArr[i].data[d_date];
                for (let k = 0; k < resdata.length; k++) {
                    if (d_dateStr == resdata[k]['startTime']) {
                        console.log(resdata[k]);
                        let objdata = {
                            date: d_date,
                            txt_en: resdata[k].title,
                            txt_cn: resdata[k].summary
                        }
                        // 开始写入文件
                        let fsStr = '------';
                        let istr = objdata.date + fsStr + objdata.txt_cn + fsStr + objdata.txt_en + '\n';
                        fs.writeFileSync(txtFile, istr, {
                            flag: 'a'
                        }, (error) => {
                            if (error) {
                                return new Error(error);
                            }
                        });
                        // 按时间分组
                        let g_date = (objdata.date).substr(0, 7);
                        if (!dataArr[g_date]) {
                            dataArr[g_date] = [];
                        }
                        dataArr[g_date].push(objdata);
                    }
                }
            }
        }
    }
    return dataArr;
}
// 保存所有数据
function saveAllData(allDaita) {
    for (const key in allDaita) {
        let filePath = savePath + key + '.json';
        fs.writeFile(filePath, JSON.stringify(allDaita[key], null, '\t'), (error) => {
            if (error) {
                return new Error(error);
            }
            console.log('数据写入成功==' + filePath);
        })
    }
}
// 脚本开始
async function main() {
    try {
        let urlArr = await getAllDayUrl();
        console.log(urlArr);
        for (const key in urlArr) {
            let reqArr = sendAllReq(urlArr[key]);
            let resArr = await axios.all(reqArr)
            let processArr = processAllRes(urlArr[key], resArr);
            saveAllData(processArr);
            await sleep(5000); //每五秒钟获取一个月数据
        }
    } catch (error) {
        console.log('main error===', error);
    }
}

main();