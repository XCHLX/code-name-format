using System;
using System.IO;

namespace CodeNameFormat.Tools
{
    /// <summary>
    /// 文件工具类
    /// </summary>
    public static class FileTools
    {
        /// <summary>
        /// 写入配置文件
        /// </summary>
        /// <param name="baiduAPPKEY"></param>
        /// <param name="baiduSecretKey"></param>
        /// <param name="tencentAPPKEY"></param>
        /// <param name="tencentSecretKey"></param>
        /// <param name="type"></param>
        public static void WriteFileConfig(string baiduAPPKEY, string baiduSecretKey, string tencentAPPKEY, string tencentSecretKey, string type)
        {
            var strpath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);

            File.WriteAllText(strpath + "\\baiduconfig.txt", $"{baiduAPPKEY},{baiduSecretKey}");//
            File.WriteAllText(strpath + "\\tencentconfig.txt", $"{tencentAPPKEY},{tencentSecretKey}");//
            File.WriteAllText(strpath + "\\typeconfig.txt", type);
        }

        /// <summary>
        /// 读取配置文件
        /// </summary>
        /// <returns>(百度配置,腾讯配置,类型配置)</returns>
        public static (string, string, string) ReadFileConfig()
        {
            string strpath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string baidu = null;
            string tencent = null;
            string typeconfig = null;
            if (File.Exists(strpath + "\\baiduconfig.txt"))
            {
                baidu = File.ReadAllText(strpath + "\\baiduconfig.txt");
            }
            if (File.Exists(strpath + "\\tencentconfig.txt"))
            {
                tencent = File.ReadAllText(strpath + "\\tencentconfig.txt");
            }

            if (File.Exists(strpath + "\\typeconfig.txt"))
            {
                typeconfig = File.ReadAllText(strpath + "\\typeconfig.txt");
            }

            return (baidu, tencent, typeconfig);
        }
    }
}