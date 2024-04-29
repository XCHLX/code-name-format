/**
 * 百度翻译api
 */
// 引入加密算法模块，用于处理加密相关的操作
const crypto = require('crypto');
/**
 * 异步翻译函数，使用百度翻译API进行翻译
 * @param {string} q 需要翻译的文本
 * @param {string} from 原文语言代码
 * @param {string} to 目标语言代码
 * @param {string} appid 百度翻译应用的ID
 * @param {string} secretKey 百度翻译应用的密钥
 * @returns {Promise} 返回一个Promise对象，解析为翻译结果的响应
 */
async function translateAsync(q, from, to, appid, secretKey) {
  const salt = randomString(); // 生成随机字符串作为盐值

  // 使用MD5算法生成签名
  let sign = crypto
    .createHash('md5')
    .update(appid + q + salt + secretKey)
    .digest('hex');

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var urlencoded = new URLSearchParams();
  // 准备请求参数
  urlencoded.append('q', q);
  urlencoded.append('from', from);
  urlencoded.append('to', to);
  urlencoded.append('appid', appid);
  urlencoded.append('salt', salt);
  urlencoded.append('sign', sign);

  // 配置请求选项
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  // 发起翻译API请求
  return await fetch('https://fanyi-api.baidu.com/api/trans/vip/translate', requestOptions);
}

/**
 * 翻译函数，用于异步翻译文本。
 * @param {string} q 需要翻译的文本。
 * @param {string} from 原文的语言代码。
 * @param {string} to 目标语言代码。
 * @param {string} appid 翻译应用的ID。
 * @param {string} secretKey 翻译应用的密钥。
 * @returns {Promise<string>} 返回一个Promise，成功时解析为翻译后的文本，失败时reject错误对象。
 */
function translate(q, from, to, appid, secretKey) {
  return new Promise((resolve, reject) => {
    try {
      // 异步翻译调用
      translateAsync(q, from, to, appid, secretKey)
        .then(response => response.text()) // 获取翻译结果的文本形式
        .then(result => {
          resolve(result); // 成功时解析结果
        })
        .catch(error => {
          reject(error); // 错误时拒绝Promise
        });
    } catch (e) {
      console.log(e); // 捕获并打印异常
    }
  });
}

/**
 * 生成一个随机字符串
 * @param {number} e - 需要生成的随机字符串的长度，默认为16
 * @returns {string} 生成的随机字符串
 */
function randomString(e) {
  // 设置默认长度为16
  e = e || 16;
  // 定义可用字符集
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  // 通过循环生成随机字符串
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

/**
 * 提取翻译结果并将其应用到payload上
 * @param {Object} result - 包含翻译结果或错误信息的对象。
 * @param {String} payload - 需要进行翻译结果替换的字符串。
 * @returns {String} 替换翻译结果后的payload。
 */
function extractTranslationResults(result, payload) {
  // 当result中存在'trans_result'键时，遍历并替换payload中的源文本为译文
  if ('trans_result' in result) {
    result.trans_result.map(item => {
      payload = payload.replace(item.src, item.dst);
    });
  } else if ('error_msg' in result) {
    // 当result中存在错误信息时，打印错误信息并返回原始payload
    console.log('翻译失败：' + result.error_msg);
    return payload;
  }
  // 返回处理后的payload
  return payload;
}

/**
 * 导出translate函数 - 此代码段没有提供函数体，因此具体的函数功能、参数和返回值未知。
 * 需要根据实际的函数实现来添加相应的注释。
 */

module.exports.extractTranslationResults = extractTranslationResults;

module.exports.translate = translate;
