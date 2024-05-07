using System;

using TencentCloud.Common;
using TencentCloud.Common.Profile;
using TencentCloud.Tmt.V20180321;
using TencentCloud.Tmt.V20180321.Models;

namespace TencentCloudExamples
{
    /// <summary>
    /// 腾讯翻译API
    /// </summary>
    public static class TencentAPI
    {
        public static string Translate(string sourceText, string tencent)
        {
            try
            {
                // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
                // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
                // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取

                // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey
                if (string.IsNullOrWhiteSpace(tencent))
                {
                    return null;
                    //System.Windows.Forms.MessageBox.Show("请先配置腾讯翻译APPKEY");
                }
                Credential cred = new Credential
                {
                    SecretId = tencent.Split(',')[0],
                    SecretKey = tencent.Split(',')[1]
                };
                // 实例化一个client选项，可选的，没有特殊需求可以跳过
                ClientProfile clientProfile = new ClientProfile();
                // 实例化一个http选项，可选的，没有特殊需求可以跳过
                HttpProfile httpProfile = new HttpProfile
                {
                    Endpoint = ("tmt.tencentcloudapi.com")
                };
                clientProfile.HttpProfile = httpProfile;

                // 实例化要请求产品的client对象,clientProfile是可选的
                TmtClient client = new TmtClient(cred, "ap-shanghai", clientProfile);
                // 实例化一个请求对象,每个接口都会对应一个request对象
                TextTranslateRequest req = new TextTranslateRequest
                {
                    SourceText = sourceText,
                    Source = "auto",
                    Target = "en",
                    ProjectId = 0
                };
                // 返回的resp是一个TextTranslateResponse的实例，与请求对象对应
                TextTranslateResponse resp = client.TextTranslateSync(req);
                return resp.TargetText;
                // 输出json格式的字符串回包
                //Console.WriteLine(AbstractModel.ToJsonString(resp));
            }
            catch (Exception )
            {
                //System.Windows.Forms.MessageBox.Show(e.Message);
                return null;
            }
        }
    }
}