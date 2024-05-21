/**
 * 变量格式化
 */

const {
  constantCase,
  camelCase,
  capitalCase,
  pascalCase,
  pascalSnakeCase,
  sentenceCase,
  snakeCase,
  trainCase
} = require('../change-case/index.js');
// const change = require('../change-case/index.cjs')

const changeCaseMap = [
  { type: 'camelCase', handle: camelCase, description: 'camelCase 小驼峰' },
  { type: 'pascalCase', handle: pascalCase, description: 'pascalCase 大驼峰' },
  { type: 'constantCase', handle: constantCase, description: 'constantCase 常量' },
  { type: 'snakeCase', handle: snakeCase, description: 'snakeCase 下划线(小)' },
  { type: 'pascalSnakeCase', handle: pascalSnakeCase, description: 'pascalSnakeCase 下划线(大)' },
  { type: 'capitalCase', handle: capitalCase, description: 'capitalCase 分词(大)' },
  { type: 'sentenceCase', handle: sentenceCase, description: 'sentenceCase 分词(小)' },
  { type: 'trainCase', handle: trainCase, description: 'trainCase 连字符' }
];

/**
 * 将指定的对象转换为字符串形式。
 * @param {string} str - 需要转换的字符串。
 * @param {string} type - 转换类型，指定转换的方式。
 * @returns {string} - 根据指定的类型返回转换后的字符串。
 */
function toStr(str, type) {
  // 创建一个用于存储转换结果的数组
  let strObj = [];
  if (type) {
    // 将原始字符串转换为小驼峰格式，并添加到结果数组中
    const changecase = changeCaseMap.find(it => it.type === type);
    if (changecase) {
      strObj.push({ title: changecase.handle(str), description: changecase.description });
    }
  } else {
    changeCaseMap.forEach(item => {
      strObj.push({ title: item.handle(str), description: item.description });
    });
  }

  return strObj;
}

module.exports = toStr;
