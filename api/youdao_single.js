/**
 * 获取有道词典每日一句
 * https://dict.youdao.com/infoline?mode=publish&date=2021-03-15&update=auto&apiversion=6.0
 */

const axios = require('axios');
const fs = require('fs'); // 文件操作
const path = require('path');
const appPath = path.resolve('.');
const savePath = appPath + '/data/youdao/';
const moment = require('moment');
const { file_is_exists, writeFileSync, writeFile } = require('../tools/common');

// 脚本开始
async function main() {
    try {
        const nowDate = moment().format('YYYY-MM-DD');
        const url = 'https://dict.youdao.com/infoline?mode=publish&date=' + nowDate + '&update=auto&apiversion=6.0';
        const jsonFile = savePath + moment().format('YYYY-MM') + '.json';
        const txtFile = savePath + 'youdao.txt';
        const oldData = await file_is_exists(jsonFile) ? require(jsonFile) : [];
        let nowData = await axios.get(url);
        let d_dateStr = nowDate.replace(/-/g, '') + '0000';
        for (let k = 0; k < nowData.data[nowDate].length; k++) {
            if (d_dateStr == nowData.data[nowDate][k]['startTime']) {
                let objdata = {
                    date: nowDate,
                    txt_en: nowData.data[nowDate][k].title,
                    txt_cn: nowData.data[nowDate][k].summary
                }
                // 开始写入txt文件
                let fsStr = '------';
                let istr = objdata.date + fsStr + objdata.txt_cn + fsStr + objdata.txt_en + '\n';
                writeFileSync(txtFile, istr, 'a');
                // fs.writeFileSync(txtFile, istr, { flag: 'a' }, (error) => {
                //     if (error) { return new Error(error); }
                // })
                oldData.push(objdata);
                writeFile(jsonFile, JSON.stringify(oldData, null, '\t'), 'w');
                // fs.writeFile(jsonFile, JSON.stringify(oldData, null, '\t'), (error) => {
                //     if (error) { return new Error(error); }
                // })
            }
        }
    } catch (error) {
        console.log('youdao error===', error);
    } finally {
        console.log('get youdao end===');
    }
}

module.exports = main;