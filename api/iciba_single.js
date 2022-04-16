/**
 * 获取爱词霸的每日一句
 * http://open.iciba.com/dsapi/?date=
 */
const pname = 'iciba';
const axios = require('axios');
const fs = require('fs'); // 文件操作
const path = require('path');
const appPath = path.resolve('.');
const savePath = appPath + '/data/' + pname + '/';
const moment = require('moment');
const { file_is_exists, writeFileSync, writeFile } = require('../tools/common');

// 脚本开始
async function main() {
    let resObj = ['金山词霸'];
    try {
        const url = 'http://open.iciba.com/dsapi/?date=' + moment().format('YYYY-MM-DD');
        const jsonFile = savePath + moment().format('YYYY-MM') + '.json';
        const txtFile = savePath + pname + '.txt';
        const oldData = await file_is_exists(jsonFile) ? require(jsonFile) : [];
        let nowData = await axios.get(url);
        let objdata = {
            date: nowData.data.dateline,
            txt_en: nowData.data.content,
            txt_cn: nowData.data.note,
            readmp3: nowData.data.tts
        }
        resObj.push(objdata.txt_en);
        resObj.push(objdata.txt_cn);
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
        console.log(pname + ' error===', error);
    } finally {
        console.log('get ' + pname + ' end===');
        return resObj;
    }
}

module.exports = main;