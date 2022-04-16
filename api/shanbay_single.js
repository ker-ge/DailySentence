/**
 * 获取扇贝单词的每日一句
 * https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=
 */
const pname = 'shanbay';
const axios = require('axios');
const fs = require('fs'); // 文件操作
const path = require('path');
const appPath = path.resolve('.');
const savePath = appPath + '/data/' + pname + '/';
const moment = require('moment');
const { file_is_exists, writeFileSync, writeFile } = require('../tools/common');

// 脚本开始
async function main() {
    let resObj = ['扇贝单词'];
    try {
        const url = 'https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=' + moment().format('YYYY-MM-DD');
        const jsonFile = savePath + moment().format('YYYY-MM') + '.json';
        const txtFile = savePath + pname + '.txt';
        const oldData = await file_is_exists(jsonFile) ? require(jsonFile) : [];
        let nowData = await axios.get(url);
        let objdata = {
            date: nowData.data.assign_date,
            txt_en: nowData.data.content,
            txt_cn: nowData.data.translation,
            author: nowData.data.author,
            share_img: nowData.data.origin_img_urls[0],
            share_url: nowData.data.share_url
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