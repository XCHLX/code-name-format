using CaseExtensions;

namespace CodeNameFormat.Tools
{
    /// <summary>
    /// Variable format
    /// </summary>
    internal class VariableFormat
    {
        public static string Format(string str, FormatEnum type)
        {
            str = TranslateHelp.Translate(str);

            switch (type)
            {
                case FormatEnum.CamelCase:
                    return StringExtensions.ToCamelCase(str);

                case FormatEnum.PascalCase:
                    return StringExtensions.ToPascalCase(str);

                case FormatEnum.SnakeCase:
                    return StringExtensions.ToSnakeCase(str);

                case FormatEnum.SnakeCaseUP:
                    return StringExtensions.ToSnakeCase(str).ToUpper();

                default: return str;
            }
        }
    }
}