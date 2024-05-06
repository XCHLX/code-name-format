using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeNameFormat.Tools
{
    public class FileTools
    {

        public static (string, string) writeFile(string baiduapi, string baiduSecretKey, string tencentApi, string tencentSecretKey)
        {
            var strpath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);


            File.WriteAllText(strpath + "\\baiduconfig.txt", $"{baiduapi},{baiduSecretKey}");//第一种
            File.WriteAllText(strpath + "\\tencentconfig.txt", $"{tencentApi},{tencentSecretKey}");//第一种

            return ("", "");
        }

        public static (string, string) readFile(string filePath)
        {
            return ("", "");

        }

    }
}
