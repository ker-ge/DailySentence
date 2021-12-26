const fs = require('fs'); // 文件操作
const readline = require('readline');

/**
 * 异步写入文件
 * @param {*} filePath 写入文件地址
 * @param {*} Data 写入文件数据
 * @param {*} flag 写入方式 a:追加，w:覆盖
 */
exports.writeFile = function (filePath, Data, flag = 'w') {
  try {
    fs.writeFile(filePath, Data, {
      flag: flag
    }, function (err) {
      if (err) throw err;
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 同步写入文件
 * @param {*} filePath 写入文件地址
 * @param {*} Data 写入文件数据
 * @param {*} flag 写入方式 a:追加，w:覆盖
 */
exports.writeFileSync = function (filePath, Data, flag = 'w') {
  try {
    fs.writeFileSync(filePath, Data, {
      flag: flag
    }, function (err) {
      if (err) throw err;
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 异步读取文件
 * @param {*} filePath 
 * @param {*} encode 
 */
exports.readFile = function (filePath, encode = 'utf-8') {
  try {
    return fs.readFile(filePath, encode);
  } catch (error) {
    console.log(error);
  }
}

/**
 * 同步读取文件
 * @param {*} filePath 
 * @param {*} encode 
 */
exports.readFileSync = function (filePath, encode = 'utf-8') {
  try {
    return fs.readFileSync(filePath, encode);
  } catch (error) {
    console.log(error);
  }
}

// 判断文件是否存在
exports.file_is_exists = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.access(filePath, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

/**
 * 文件内容转数组
 * @param {*} filePath 文件地址
 */
exports.readlineData = function (filePath) {
  return new Promise((resolve, reject) => {
    try {
      let tempArr = [];
      let rl = readline.createInterface({
        input: fs.createReadStream(filePath)
      });
      rl.on('line', function (data) { //事件监听
        try {
          let newData = JSON.parse(data);
          tempArr.push(newData);
        } catch (error) {
          console.log(error);
        }
      }).on('close', () => {
        resolve(tempArr);
      });
    } catch (err) {
      console.error(err);
    }
  });
}

/**
 * 计算所有具体日期
 * @param {*} yArr 年份数组 ['2020', '2021'];
 * @param {*} mArr 月份数组 ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
 * @param {*} startDate 开始计算时间 2020-10-01
 * @returns ['2020-10-01', ..... '当前时间']
 */
exports.getEveryDay = function (yArr, mArr, startDate = null) {
  const daysArr = [];
  for (let i = 0; i < yArr.length; i++) {
    for (let j = 0; j < mArr.length; j++) {
      let DaysInMonth = getDaysInMonth(yArr[i], mArr[j]);
      for (let k = 0; k < DaysInMonth.length; k++) {
        if (judgeDate(DaysInMonth[k], startDate)) {
          daysArr.push(DaysInMonth[k]);
        }
      }
    }
  }
  return daysArr;

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
  function judgeDate(tomodifyDate, startDate = null) {
    let timeSum = new Date().getTime() - new Date(tomodifyDate).getTime();
    if (!startDate) {
      return timeSum > 0 ? true : false;
    }
    let startSum = new Date(startDate).getTime() - new Date(tomodifyDate).getTime();
    return (timeSum > 0 && startSum <= 0) ? true : false;
  }
}