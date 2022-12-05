import xlsx from 'node-xlsx';
import fs from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
import inquirer from 'inquirer'

console.log(`${chalk.green('\n欢迎使用非小酋抽卡导入工具\n因本程序会直接覆盖原有数据\n使用前请确保非小酋的数据完整(建议手动备份原有数据)\n并且至少在Yunzai-Bot更新过一次抽卡记录\n此程序仅用于非小酋，不兼容其他xlsx\n\n请按提示输入进行配置')}`)


let input = await inquirer.prompt({
    type: 'Input',
    message: '请输入你的UID:',
    name: 'uid',
    validate (value) {
      if (!value) return 'UID不能为空'
      if (/^[0-9]+$/.test(value)) return true
      return '请输入正确UID'
    }
  });

let qn = await inquirer.prompt({
    type: 'Input',
    message: '请输入你的QQ:',
    name: 'qq',
    validate (value) {
      if (!value) return 'QQ不能为空'
      if (/^[0-9]+$/.test(value)) return true
      return '请输入正确QQ'
    }
  });

let lujing = await inquirer.prompt({
    type: 'Input',
    message: '请输入你Yunzai-Bot安装目录，只支持V3\n例如默认安装目录/root/Yunzai-Bot/\n路径:',
    name: 'lj',
    validate (value) {
      if (!value) return '路径不能为空'
      return true
    }
  });
  
let daoru = await inquirer.prompt({
    type: 'Input',
    message: '请输入“非小酋.xlsx”文件路径\n路径:',
    name: 'fxq',
    validate (value) {
      if (!value) return '路径不能为空'
      return true
    }
  });
  
//console.log(input, qn, lujing);
let uid = input.uid;  
let qq = qn.qq
let lj = lujing.lj
let fxq = daoru.fxq
//console.log(uid, qq, lj);
let abc = lj+'/data/gachaJson/'+qq+'/'+uid+'/';

const file = abc+'301.json'; // 检查文件是否存在于当前目录中。

fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
 if (err) {
  console.error( `导入路径:${file} \nxlsx路径：${fxq}${err.code === 'ENOENT' ?'没有找到抽卡历史，程序已终止\n1.请检查路径是否正确\n2.是否在Yunzai-Bot获取过抽卡记录\n3.xlsx路径是否正确': ''}`); 
  return true;
  } else { 
  console.log(`${file} 302.json 200.json  导入完成`); 
  } 
});

// export async function yyy(e){

// 读取xlsx
const sheets = xlsx.parse(fxq);
const jueseData = sheets[0].data;
const wuqiData = sheets[1].data;
const changzhuData = sheets[2].data;

// 角色祈愿
let juese = [];
// console.log(jueseData, 'jueseData')
jueseData.forEach((item, index) => {
  if (index == 0) {
      return;
  } else {
      juese.unshift({
            "uid": String(uid),
            "gacha_type": "301",
            "item_id": "",
            "count": "1",
            "time": item[0],
            "name": item[1],
            "lang": "zh-cn",
            "item_type": item[2],
            "rank_type": String(item[3]),
            "id": item[6],
        },);
    }
});

// 武器祈愿
let wuqi = [];
// console.log(wuqiData, 'wuqiData')
wuqiData.forEach((item, index) => {
  if (index == 0) {
      return;
  } else {
      wuqi.unshift({
            "uid": String(uid),
            "gacha_type": "302",
            "item_id": "",
            "count": "1",
            "time": item[0],
            "name": item[1],
            "lang": "zh-cn",
            "item_type": item[2],
            "rank_type": String(item[3]),
            "id": item[6],
        },);
    }
});

// 常驻祈愿
let changzhu = [];
// console.log(changzhuData, 'changzhuData')
changzhuData.forEach((item, index) => {
    if (index == 0) {
        return;
    } else {
        changzhu.unshift({
            "uid": String(uid),
            "gacha_type": "200",
            "item_id": "",
            "count": "1",
            "time": item[0],
            "name": item[1],
            "lang": "zh-cn",
            "item_type": item[2],
            "rank_type": String(item[3]),
            "id": item[6],
        },);
    }
});

const cz = changzhu;
const js = juese;
const wq = wuqi;
fs.writeFileSync(abc+'301.json',JSON.stringify(js, null, "\t"));
fs.writeFileSync(abc+'302.json',JSON.stringify(wq, null, "\t"));
fs.writeFileSync(abc+'200.json',JSON.stringify(cz, null, "\t"));

console.log("导入完成")

// }