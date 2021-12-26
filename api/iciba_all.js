/**
 * 获取爱词霸的每日一句历史数据
 * http://open.iciba.com/dsapi/?date=2018-01-01 - now
 */

const axios = require('axios');
const fs = require('fs'); // 文件操作
const path = require('path');
const appPath = path.resolve('.');
const icibaUrl = 'http://open.iciba.com/dsapi/?date=';
const yArr = ['2018','2019','2020','2021'];
const mArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const startDate = '2018-01-01';
const savePath = appPath + '/data/iciba/';
const txtFile = savePath + 'iciba.txt';
// 等待毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});
// 计算所有具体日期
function getEveryDay() {
    const daysArr = [];
    for (let i = 0; i < yArr.length; i++) {
        for (let j = 0; j < mArr.length; j++) {
            let DaysInMonth = getDaysInMonth(yArr[i], mArr[j]);
            for (let k = 0; k < DaysInMonth.length; k++) {
                if (judgeDate(DaysInMonth[k])) {
                    daysArr.push(DaysInMonth[k]);
                }
            }
        }
    }
    return daysArr;
}
//根据某年某月计算出具体日期
function getDaysInMonth(year, month) {
    const daysOfMonth = [];
    // month = parseInt(month, 10);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= lastDayOfMonth; i++) {
        if (i < 10) {
            daysOfMonth.push(year + "-" + month + "-" + "0" + i);
        } else {
            daysOfMonth.push(year + "-" + month + "-" + i);
        }
    }
    return daysOfMonth;
}
// 计算传入时间是否大于当前时间
// 如果是负数，说明修改日期大于了当前日期
// 如果是正数，说明修改日期小于等于当前日期
function judgeDate(tomodifyDate) {
    let timeSum = new Date().getTime() - new Date(tomodifyDate).getTime();
    return timeSum > 0 ? true : false;
}
// 整理获取所有日期的url
function getAllDayUrl() {
    let daysUrlArr = [];
    let days = getEveryDay();
    for (let i = 0; i < days.length; i++) {
        // 按时间分组
        let g_date = days[i].substr(0, 7);
        if (!daysUrlArr[g_date]) {
            daysUrlArr[g_date] = [];
        }
        daysUrlArr[g_date].push(icibaUrl + days[i]);
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
function processAllRes(resArr) {
    let dataArr = [];
    for (let i = 0; i < resArr.length; i++) {
        let objdata = {
            date: resArr[i].data.dateline,
            txt_en: resArr[i].data.content,
            txt_cn: resArr[i].data.note,
            readmp3: resArr[i].data.tts
        }
        // 开始写入文件
        let fsStr = '------';
        let istr = objdata.date + fsStr + objdata.txt_cn + fsStr + objdata.txt_en + '\n';
        fs.writeFileSync(txtFile, istr, {flag: 'a'}, (error) => {
            if (error) { return new Error(error); }
        })
        // 按时间分组
        let g_date = (objdata.date).substr(0, 7);
        if (!dataArr[g_date]) {
            dataArr[g_date] = [];
        }
        dataArr[g_date].push(objdata);
    }
    return dataArr;
}
// 保存所有数据
function saveAllData(allDaita) {
    for (const key in allDaita) {
        let filePath = savePath + key + '.json';
        fs.writeFile(filePath, JSON.stringify(allDaita[key], null, '\t'), (error) => {
            if (error) {return new Error(error);}
            console.log('数据写入成功==' + filePath);
        })
    }
}
// 脚本开始
async function main() {
    try {
        let urlArr = await getAllDayUrl();
        for (const key in urlArr) {
            console.log(urlArr[key]);
            let reqArr = sendAllReq(urlArr[key]);
            let resArr = await axios.all(reqArr)
            let processArr = processAllRes(resArr);
            saveAllData(processArr);
            await sleep(5000);//每五秒钟获取一个月数据
        }
    } catch (error) {
        console.log('main error===', error);
    }
}

main();