
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace TencentCloudExamples
{
    /// <summary>
    /// 腾讯翻译API
    /// </summary>
    public static class TencentAPI
    {
        private static readonly HttpClient Client = new HttpClient();
        public static string Translate(string sourceText, string tencent)
        {

            if (string.IsNullOrWhiteSpace(tencent))
            {
                return null;
                //System.Windows.Forms.MessageBox.Show("请先配置腾讯翻译APPKEY");
            }

            var secretId = tencent.Split(',')[0];
            var secretKey = tencent.Split(',')[1];
            var token = "";
            var service = "tmt";
            var version = "2018-03-21";
            var action = "TextTranslate";
            var body = "{\"SourceText\":\"" + sourceText + "\",\"Source\":\"auto\",\"Target\":\"en\",\"ProjectId\":0}";
            var region = "ap-shanghai";
            var resp = DoRequest(secretId, secretKey, service, version, action, body, region, token);
            var res = JsonSerializer.Deserialize<TencentResponse>(resp);

            return res.Response.TargetText;




        }

        static string DoRequest(
    string secretId, string secretKey,
    string service, string version, string action,
    string body, string region, string token
)
        {
            var request = BuildRequest(secretId, secretKey, service, version, action, body, region, token);
            var response = Client.SendAsync(request).Result;
            return response.Content.ReadAsStringAsync().Result;
        }

        static HttpRequestMessage BuildRequest(
            string secretId, string secretKey,
            string service, string version, string action,
            string body, string region, string token
        )
        {
            var host = "tmt.tencentcloudapi.com";
            var url = "https://" + host;
            var contentType = "application/json; charset=utf-8";
            var timestamp = ((int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds).ToString();
            var auth = GetAuth(secretId, secretKey, host, contentType, timestamp, body);
            var request = new HttpRequestMessage();
            request.Method = HttpMethod.Post;
            request.Headers.Add("Host", host);
            request.Headers.Add("X-TC-Timestamp", timestamp);
            request.Headers.Add("X-TC-Version", version);
            request.Headers.Add("X-TC-Action", action);
            request.Headers.Add("X-TC-Region", region);
            request.Headers.Add("X-TC-Token", token);
            request.Headers.Add("X-TC-RequestClient", "SDK_NET_BAREBONE");
            request.Headers.TryAddWithoutValidation("Authorization", auth);
            // request.Headers.Authorization = new AuthenticationHeaderValue(auth);
            request.RequestUri = new Uri(url);


            request.Content = new StringContent(body);
            request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
            Console.WriteLine(request);
            return request;
        }

        static string GetAuth(
            string secretId, string secretKey, string host, string contentType,
            string timestamp, string body
        )
        {
            var canonicalURI = "/";
            var canonicalHeaders = "content-type:" + contentType + "\nhost:" + host + "\n";
            var signedHeaders = "content-type;host";
            var hashedRequestPayload = Sha256Hex(body);
            var canonicalRequest = "POST" + "\n"
                                          + canonicalURI + "\n"
                                          + "\n"
                                          + canonicalHeaders + "\n"
                                          + signedHeaders + "\n"
                                          + hashedRequestPayload;

            var algorithm = "TC3-HMAC-SHA256";
            var date = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddSeconds(int.Parse(timestamp))
                .ToString("yyyy-MM-dd");
            var service = host.Split('.')[0];
            var credentialScope = date + "/" + service + "/" + "tc3_request";
            var hashedCanonicalRequest = Sha256Hex(canonicalRequest);
            var stringToSign = algorithm + "\n"
                                         + timestamp + "\n"
                                         + credentialScope + "\n"
                                         + hashedCanonicalRequest;

            var tc3SecretKey = Encoding.UTF8.GetBytes("TC3" + secretKey);
            var secretDate = HmacSha256(tc3SecretKey, Encoding.UTF8.GetBytes(date));
            var secretService = HmacSha256(secretDate, Encoding.UTF8.GetBytes(service));
            var secretSigning = HmacSha256(secretService, Encoding.UTF8.GetBytes("tc3_request"));
            var signatureBytes = HmacSha256(secretSigning, Encoding.UTF8.GetBytes(stringToSign));
            var signature = BitConverter.ToString(signatureBytes).Replace("-", "").ToLower();

            return algorithm + " "
                             + "Credential=" + secretId + "/" + credentialScope + ", "
                             + "SignedHeaders=" + signedHeaders + ", "
                             + "Signature=" + signature;
        }

        public static string Sha256Hex(string s)
        {
            using (SHA256 algo = SHA256.Create())
            {
                byte[] hashbytes = algo.ComputeHash(Encoding.UTF8.GetBytes(s));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < hashbytes.Length; ++i)
                {
                    builder.Append(hashbytes[i].ToString("x2"));
                }

                return builder.ToString();
            }
        }

        private static byte[] HmacSha256(byte[] key, byte[] msg)
        {
            using (HMACSHA256 mac = new HMACSHA256(key))
            {
                return mac.ComputeHash(msg);
            }
        }
    }



    public class TextTranslateResponse
    {
        /// <summary>
        /// 
        /// </summary>
        public Error Error { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string RequestId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Source { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Target { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TargetText { get; set; }
    }

    public class TencentResponse
    {
        /// <summary>
        /// 
        /// </summary>
        public TextTranslateResponse Response { get; set; }
    }

    //如果好用，请收藏地址，帮忙分享。
    public class Error
    {
        /// <summary>
        /// 
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// 请求缺少必传参数 `Target` 。
        /// </summary>
        public string Message { get; set; }
    }






}