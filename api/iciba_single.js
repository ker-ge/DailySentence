/**
 * 获取爱词霸的每日一句
 * http://open.iciba.com/dsapi/?date=
 */

const axios = require('axios');
const fs = require('fs'); // 文件操作
const path = require('path');
const appPath = path.resolve('.');
const icibaPath = appPath + '/data/iciba/';
const moment = require('moment');
const { file_is_exists, writeFileSync, writeFile } = require('../tools/common');

// 脚本开始
async function main() {
    try {
        const url = 'http://open.iciba.com/dsapi/?date=' + moment().format('YYYY-MM-DD');
        const jsonFile = icibaPath + moment().format('YYYY-MM') + '.json';
        const txtFile = icibaPath + 'iciba.txt';
        const oldData = await file_is_exists(jsonFile) ? require(jsonFile) : [];
        let nowData = await axios.get(url);
        let objdata = {
            date: nowData.data.dateline,
            txt_en: nowData.data.content,
            txt_cn: nowData.data.note,
            readmp3: nowData.data.tts
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
    } catch (error) {
        console.log('iciba error===', error);
    } finally {
        console.log('get iciba end===');
    }
}

module.exports = main;