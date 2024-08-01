using System.Text;
using System.Text.RegularExpressions;

namespace ThreeF_WebPortal.Lib
{
    public static class StringHelper
    {
        public static string ToUnsignString(string input)
        {
            input = input.Trim();
            for (int i = 0x20; i < 0x30; i++)
            {
                input = input.Replace(((char)i).ToString(), " ");
            }
            input = input.Replace(".", "");
            input = input.Replace(" ", "_");
            input = input.Replace(",", "");
            input = input.Replace(";", "");
            input = input.Replace(":", "");
            input = input.Replace("+", "");
            input = input.Replace("  ", "_");
            input = input.Replace("____", "_");
            input = input.Replace("___", "_");
            input = input.Replace("__", "_");
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string str = input.Normalize(NormalizationForm.FormD).ToLower();
            string str2 = regex.Replace(str, string.Empty).Replace('đ', 'd').Replace('Đ', 'D');
            while (str2.IndexOf("?") >= 0)
            {
                str2 = str2.Remove(str2.IndexOf("?"), 1);
            }
            while (str2.Contains("--"))
            {
                str2 = str2.Replace("--", "_").ToLower();
            }
            return str2;
        }
        public static string ToUrlSlug(string value)
        {
            //First to lower case 
            value = value.ToLowerInvariant();

            //Remove all accents
            var bytes = Encoding.GetEncoding("Cyrillic").GetBytes(value);

            value = Encoding.ASCII.GetString(bytes);

            //Replace spaces 
            value = Regex.Replace(value, @"\s", "-", RegexOptions.Compiled);

            //Remove invalid chars 
            value = Regex.Replace(value, @"[^\w\s\p{Pd}]", "", RegexOptions.Compiled);

            //Trim dashes from end 
            value = value.Trim('-', '_');

            //Replace double occurences of - or \_ 
            value = Regex.Replace(value, @"([-_]){2,}", "$1", RegexOptions.Compiled);

            return value;
        }
        public static string ToUrlClean(string input)
        {
            input = input.Trim();
            input = input.ToLowerInvariant();
            input = Regex.Replace(input, "[^a-zA-Z0-9 ]", "");
            input = Regex.Replace(input, " +", "_");
            return input;
        }
        public static string ToTelephoneNumerSendSMS(string input)
        {
            input = input.Replace(" ", string.Empty);
            input = input.Replace(".", string.Empty);
            input = input.Replace( "+84", "0");
            input = input.Replace( "(+84)", "0");
            return input;
        }
    }
}
