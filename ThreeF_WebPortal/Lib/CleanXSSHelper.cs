using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace ThreeF_WebPortal.Lib
{
    public static class CleanXSSHelper
    {
        public static List<T> CleanXSSListObject<T>(List<T> list)
        {
            for (int i = 0; i < list.Count(); i++)
            {
                list[i] = CleanXSSObject<T>(list[i]);
            }
            return list;
        }
        public static T CleanXSSObject<T>(T obj)
        {
            Type type = obj.GetType();
            PropertyInfo[] prop = type.GetProperties();
            foreach (PropertyInfo p in prop)
            {
                //Debug.WriteLine("Name:" + p.Name + " - Type:" + p.PropertyType + " - Value:" + p.GetValue(obj));
                if (p.PropertyType == typeof(string))
                {
                    p.SetValue(obj, CleanXSS(p.GetValue(obj)?.ToString()));
                }
            }
            return obj;
        }
        public static string CleanXSS(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return string.Empty;
            }
            //return Sanitizer.GetSafeHtmlFragment(input);

            var pattern = new StringBuilder();

            //Checks any js events i.e. onKeyUp(), onBlur(), alerts and custom js functions etc.             
            pattern.Append(@"((alert|on\w+|function\s+\w+)\s*\(\s*(['+\d\w](,?\s*['+\d\w]*)*)*\s*\))");

            //Checks any html tags i.e. <script, <embed, <object etc.
            pattern.Append(@"|(<(script|embed|frame|frameset|object|img|applet|body|html|style|layer|link|ilayer|meta|bgsound)>)");
            pattern.Append(@"|(</(script|embed|frame|frameset|object|img|applet|body|html|style|layer|link|ilayer|meta|bgsound)>)");
            if (Regex.IsMatch(System.Web.HttpUtility.UrlDecode(input), pattern.ToString(), RegexOptions.IgnoreCase | RegexOptions.Compiled))
            {
                return Regex.Replace(input, pattern.ToString(), "", RegexOptions.IgnoreCase | RegexOptions.Compiled, TimeSpan.FromSeconds(0.5));
            }
            return input;
        }
    }
}
