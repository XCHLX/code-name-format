/**
 * 百度翻译api模块
 * 该模块提供了使用百度翻译API进行文本翻译的功能
 */

// 引入加密算法模块，用于处理签名的生成
const crypto = require('crypto');
const axios = require('axios');
var qs = require('qs');

/**
 * 使用百度翻译API进行翻译
 * @param {string} q 需要翻译的文本
 * @param {string} appid 百度翻译应用的ID
 * @param {string} secretKey 百度翻译应用的密钥
 * @param {string} from 原文语言代码，默认为'auto'，表示自动识别
 * @param {string} to 目标语言代码，默认为'en'，表示英语
 * @returns {Promise<baiduResponse>} 返回一个Promise对象，解析为翻译结果的响应
 */
function baiduTranslateApi(
  q: string,
  appid: string,
  secretKey: string,
  from: string = 'auto',
  to: string = 'en'
): Promise<baiduResponse> {
  // 生成用于签名的随机字符串
  const salt = randomString();

  // 生成签名
  let sign = crypto
    .createHash('md5')
    .update(appid + q + salt + secretKey)
    .digest('hex');

  // 准备请求参数
  var data = qs.stringify({
    q,
    from,
    to,
    appid,
    salt,
    sign
  });

  // 发起翻译请求并处理结果
  return new Promise((resolve, reject) => {
    try {
      axios({
        method: 'post',
        url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: data
      })
        .then(function (response: any) {
          resolve(response.data as baiduResponse);
        })
        .catch(function (error: any) {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 生成一个随机字符串
 * @param {number} e 需要生成的随机字符串的长度，默认为16
 * @returns {string} 生成的随机字符串
 */
function randomString(e: number = 16) {
  // 生成默认长度为16的随机字符串
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i: number = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a));
  }
  return n;
}

// 翻译结果的响应接口
export interface baiduResponse {
  from: string; // 原文语言
  to: string; // 目标语言
  error_msg: string; // 错误信息
  error_code: string; // 错误码
  trans_result: Array<TransResultItem>; // 翻译结果数组
}
// 翻译结果项接口
export interface TransResultItem {
  src: string; // 原文
  dst: string; // 翻译后的文本
}

/**
 * 批量翻译文本中的中文
 * @param {string} str 需要翻译的文本
 * @param {string} appid 百度翻译应用的ID
 * @param {string} secretKey 百度翻译应用的密钥
 * @returns {Promise<string>} 翻译后的文本
 */
async function baiduTxtTranslate(
  str: string,
  appid: string,
  secretKey: string,
  cacheDictionary: { [key: string]: string }
): Promise<string> {
  // 判断是否有中文
  const arrayQ = str.match(/[\u4e00-\u9fa5]+/g);
  let strq: string = '';
  if (arrayQ) {
    // 检测是否有翻译缓存
    for (const iterator of arrayQ) {
      if (cacheDictionary[iterator]) {
        str = str.replace(iterator, cacheDictionary[iterator]);
      } else {
        strq += iterator + '\n';
      }
    }
    if (strq === '') {
      return str; // 没有中文，直接返回
    }
    // 批量翻译中文内容
    await baiduTranslateApi(strq, appid, secretKey)
      .then((res: baiduResponse) => {
        if (res.error_msg) {
          // vscode.window.showInformationMessage(`翻译失败:${res.error_msg} 请设置正确的appkey和密钥`);
        } else {
          // 替换文本中的翻译结果
          res.trans_result.map((item: TransResultItem) => {
            // 结果存入缓存
            cacheDictionary[item.src] = item.dst;
            str = str.replace(item.src, ` ${item.dst} `);
          });
        }
      })
      .catch((err: any) => {
        /* 错误处理 */
      });
  }
  return str; // 返回处理后的文本
}

export { baiduTxtTranslate };
