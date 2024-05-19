// 引入腾讯云SDK
const tencentcloud = require('tencentcloud-sdk-nodejs-tmt');
import * as vscode from 'vscode';

/**
 * 使用腾讯翻译API进行文本翻译的函数。
 * @param SourceText 待翻译的源文本。
 * @param secretId 腾讯云API的密钥ID。
 * @param secretKey 腾讯云API的密钥Key。
 * @param Source 源语言代码，默认为'auto'，自动识别源语言。
 * @param Target 目标语言代码，默认为'en'，英语。
 * @param ProjectId 项目ID，默认为0，表示使用公共模板。
 * @returns 返回一个Promise对象，成功时解析为翻译结果数据，失败时reject错误信息。
 */
function tencentTranslate(
  SourceText: string,
  secretId: string,
  secretKey: string,
  Source: string = 'auto',
  Target: string = 'en',
  ProjectId: number = 0
): Promise<tencentResponse> {
  // 实例化TmtClient配置
  const TmtClient = tencentcloud.tmt.v20180321.Client;
  const clientConfig = {
    credential: {
      secretId,
      secretKey
    },
    region: 'ap-shanghai', // 指定API服务的区域
    profile: {
      httpProfile: {
        endpoint: 'tmt.tencentcloudapi.com' // 指定服务端点
      }
    }
  };

  // 实例化客户端
  const client = new TmtClient(clientConfig);

  // 构建翻译请求参数
  const params = {
    SourceText,
    Source,
    Target,
    ProjectId
  };

  // 发起翻译请求
  return new Promise((resolve, reject) => {
    try {
      client.TextTranslate(params).then(
        (data: tencentResponse) => {
          resolve(data); // 成功时返回翻译结果
        },
        (err: any) => {
          reject(err); // 失败时返回错误信息
        }
      );
    } catch (e) {
      reject(e); // 异常时返回异常信息
    }
  });
}

interface tencentResponse {
  TargetText: string;
  Source: string;
  Target: string;
  RequestId: string;
}

/**
 * 批量翻译文本中的中文字符串。
 * @param str 待处理的文本字符串。
 * @param appid 腾讯云API的appid。
 * @param secretKey 腾讯云API的密钥Key。
 * @returns 返回处理后的文本字符串。
 */
async function tencentTxtTranslate(
  str: string,
  appid: string,
  secretKey: string,
  cacheDictionary: { [key: string]: string }
): Promise<string> {
  // 判断是否有中文
  const arrayQ = str.match(/[\u4e00-\u9fa5]+/g);
  if (arrayQ) {
    // 批量翻译
    for (const q of arrayQ) {
      // 检测是否有翻译缓存;
      if (cacheDictionary[q]) {
        str = str.replace(q, cacheDictionary[q]);
      } else {
        await tencentTranslate(q, appid, secretKey)
          .then(data => {
            console.log(data);
            // 结果存入缓存
            cacheDictionary[q] = data.TargetText;
            str = str.replace(q, ` ${data.TargetText} `);
          })
          .catch(err => {}); // 忽略翻译错误
      }
    }
  }
  return str;
}

export { tencentTxtTranslate };
