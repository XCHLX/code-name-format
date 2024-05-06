using System.Text.RegularExpressions;
using TencentCloudExamples;

namespace CodeNameFormat.Tools
{
    /// <summary>
    /// Translate the text to the language of the game
    /// </summary>
    internal class TranslateHelp
    {
        /// <summary>
        /// Translate the text to the language of the game
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string Translate(string str)
        {
            var ms = GetChineseWord(str);

            var config = FileTools.ReadFileConfig();

            if (config.Item3 == "百度翻译")
            {
                string q = "";
                foreach (Match item in ms)
                {
                    q += item.Value + "\n";
                }
                var res = BaiDuAPI.Translate(q, config.Item1);

                if (string.IsNullOrWhiteSpace(res.ErrorCode))
                {
                    foreach (var item in res.TransResult)
                    {
                        str = str.Replace(item.Src, " " + item.Dst + " ");
                    }
                }
            }
            else if (config.Item3 == "腾讯翻译")
            {
                foreach (Match NextMatch in ms)
                {
                    var translate = TencentAPI.Translate(NextMatch.Value, config.Item2);
                    if (translate != null)
                    {
                        str = str.Replace(NextMatch.Value, " " + translate + " ");
                    }
                }
            }

            return str;
        }

        /// <summary>
        /// Get Chinese words in the string
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static MatchCollection GetChineseWord(string str)
        {
            string x = @"[\u4e00-\u9fa5]+";
            MatchCollection Matches = Regex.Matches(str, x, RegexOptions.IgnoreCase);
            return Matches;
        }
    }
}