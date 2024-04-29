/**
 * 腾讯翻译api
 * v0.0.1未实现。
 */

const https = require('https');
const crypto = require('crypto');

/**
 * 使用HMAC-SHA256算法和可选的密钥对消息进行哈希。
 * @param {string} message - 待哈希的消息。
 * @param {string} secret - 用于HMAC的密钥，默认为空字符串。
 * @param {string} encoding - 输出编码格式，默认为'hex'。
 * @returns {string} 返回计算得到的哈希值。
 */
function sha256(message, secret = '', encoding) {
  const hmac = crypto.createHmac('sha256', secret);
  return hmac.update(message).digest(encoding);
}

/**
 * 使用SHA256算法对消息进行哈希。
 * @param {string} message - 待哈希的消息。
 * @param {string} encoding - 输出编码格式，默认为'hex'。
 * @returns {string} 返回计算得到的哈希值。
 */
function getHash(message, encoding = 'hex') {
  const hash = crypto.createHash('sha256');
  return hash.update(message).digest(encoding);
}

/**
 * 根据时间戳生成日期字符串（YYYY-MM-DD）。
 * @param {number} timestamp - 时间戳。
 * @returns {string} 返回格式化的日期字符串。
 */
function getDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getUTCFullYear();
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
  const day = ('0' + date.getUTCDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

/**
 * 提供一个异步的文本翻译功能。
 * @param {string} SourceText - 待翻译的文本。
 * @param {string} Source - 源语言代码。
 * @param {string} Target - 目标语言代码。
 * @param {string} SECRET_ID - 用户密钥ID。
 * @param {string} SECRET_KEY - 用户密钥KEY。
 * @returns {Promise<string>} 返回一个Promise对象，成功时解析为翻译结果，失败时解析为错误信息。
 */
function translate(SourceText, Source, Target, SECRET_ID, SECRET_KEY) {
  return new Promise((resolve, reject) => {
    try {
      const TOKEN = ''; // 翻译服务的令牌，此处为空，实际应用中需从环境变量等安全方式获取。
      const host = 'tmt.tencentcloudapi.com'; // API的主机名。
      const service = 'tmt'; // 服务名称。
      const region = 'ap-shanghai'; // 地域代码。
      const action = 'TextTranslate'; // API动作。
      const version = '2018-03-21'; // API版本。
      const timestamp = parseInt(String(new Date().getTime() / 1000)); // 时间戳。
      const date = getDate(timestamp); // 格式化的日期字符串。
      const payload = `{"SourceText":"${SourceText}","Source":"${Source}","Target":"${Target}","ProjectId":0}`; // 构造请求体。

      // 步骤 1：拼接规范请求串
      const signedHeaders = 'content-type;host';
      const hashedRequestPayload = getHash(payload);
      const httpRequestMethod = 'POST';
      const canonicalUri = '/';
      const canonicalQueryString = '';
      const canonicalHeaders = 'content-type:application/json; charset=utf-8\n' + 'host:' + host + '\n';

      const canonicalRequest =
        httpRequestMethod +
        '\n' +
        canonicalUri +
        '\n' +
        canonicalQueryString +
        '\n' +
        canonicalHeaders +
        '\n' +
        signedHeaders +
        '\n' +
        hashedRequestPayload;

      // 步骤 2：拼接待签名字符串
      const algorithm = 'TC3-HMAC-SHA256';
      const hashedCanonicalRequest = getHash(canonicalRequest);
      const credentialScope = date + '/' + service + '/' + 'tc3_request';
      const stringToSign = algorithm + '\n' + timestamp + '\n' + credentialScope + '\n' + hashedCanonicalRequest;

      // 步骤 3：计算签名
      const kDate = sha256(date, 'TC3' + SECRET_KEY);
      const kService = sha256(service, kDate);
      const kSigning = sha256('tc3_request', kService);
      const signature = sha256(stringToSign, kSigning, 'hex');

      // 步骤 4：拼接 Authorization
      const authorization =
        algorithm +
        ' ' +
        'Credential=' +
        SECRET_ID +
        '/' +
        credentialScope +
        ', ' +
        'SignedHeaders=' +
        signedHeaders +
        ', ' +
        'Signature=' +
        signature;

      // 步骤 5：构造并发起请求
      const headers = {
        Authorization: authorization,
        'Content-Type': 'application/json; charset=utf-8',
        Host: host,
        'X-TC-Action': action,
        'X-TC-Timestamp': timestamp,
        'X-TC-Version': version
      };

      if (region) {
        headers['X-TC-Region'] = region;
      }
      if (TOKEN) {
        headers['X-TC-Token'] = TOKEN;
      }

      const options = {
        hostname: host,
        method: httpRequestMethod,
        headers
      };

      const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', error => {
        reject(error);
      });

      req.write(payload);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}
module.exports.translate = translate;
