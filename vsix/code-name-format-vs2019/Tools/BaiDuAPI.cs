
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Web;

namespace CodeNameFormat.Tools
{
    internal class BaiDuAPI
    {
        public static BaiDuAPIResponse Translate(string q, string baidu)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(baidu))
                {
                    return null;
                    //System.Windows.Forms.MessageBox.Show("请先配置腾讯翻译APPKEY");
                }

                // 原文
                //string q = "apple";
                // 源语言
                string from = "auto";
                // 目标语言
                string to = "en";
                // 改成您的APP ID
                string appId = baidu.Split(',')[0];
                Random rd = new Random();
                string salt = rd.Next(100000).ToString();
                // 改成您的密钥
                string secretKey = baidu.Split(',')[1];
                string sign = EncryptString(appId + q + salt + secretKey);
                string url = "http://api.fanyi.baidu.com/api/trans/vip/translate?";
                url += "q=" + HttpUtility.UrlEncode(q);
                url += "&from=" + from;
                url += "&to=" + to;
                url += "&appid=" + appId;
                url += "&salt=" + salt;
                url += "&sign=" + sign;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                request.ContentType = "text/html;charset=UTF-8";
                request.UserAgent = null;
                request.Timeout = 3000;
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream myResponseStream = response.GetResponseStream();
                StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
                string retString = myStreamReader.ReadToEnd();
                myStreamReader.Close();
                myResponseStream.Close();

                return JsonSerializer.Deserialize<BaiDuAPIResponse>(retString);
            }
            catch (Exception)
            {
                return null;
            }
        }

        // 计算MD5值
        public static string EncryptString(string str)
        {
            MD5 md5 = MD5.Create();
            // 将字符串转换成字节数组
            byte[] byteOld = Encoding.UTF8.GetBytes(str);
            // 调用加密方法
            byte[] byteNew = md5.ComputeHash(byteOld);
            // 将加密结果转换为字符串
            StringBuilder sb = new StringBuilder();
            foreach (byte b in byteNew)
            {
                // 将字节转换成16进制表示的字符串，
                sb.Append(b.ToString("x2"));
            }
            // 返回加密的字符串
            return sb.ToString();
        }
    }

    public class TransResultItem
    {
        /// <summary>
        ///
        /// </summary>
        [JsonPropertyName("src")]
        public string Src { get; set; }

        /// <summary>
        /// 苹果
        /// </summary>
        [JsonPropertyName("dst")]
        public string Dst { get; set; }
    }

    /// <summary>
    /// 百度接口返回
    /// </summary>
    public class BaiDuAPIResponse
    {
        /// <summary>
        ///
        /// </summary>
        [JsonPropertyName("from")]
        public string From { get; set; }

        /// <summary>
        ///
        /// </summary>
        [JsonPropertyName("to")]
        public string To { get; set; }

        /// <summary>
        ///
        /// </summary>
        [JsonPropertyName("trans_result")]
        public List<TransResultItem> TransResult { get; set; }

        /// <summary>
        ///
        /// </summary>
        [JsonPropertyName("error_code")]
        public string ErrorCode { get; set; }

        /// <summary>
        ///
        /// </summary>
        [JsonPropertyName("error_msg")]
        public string ErrorMsg { get; set; }
    }
}