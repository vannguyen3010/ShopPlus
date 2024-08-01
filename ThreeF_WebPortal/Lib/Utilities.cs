using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Newtonsoft.Json;
using System.Text;
using System.Collections;
using Newtonsoft.Json.Linq;
using Microsoft.Win32;
using System.Text.RegularExpressions;
namespace ThreeF_WebPortal.Lib
{
    public static partial class Utilities
    {
        public static bool isNumber(string svalue)
        {
            try
            {
                Convert.ToDouble(svalue);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static bool isEmpty(string svalue)
        {
            try
            {
                if (svalue == null)
                    return true;
                if (svalue.Trim().Equals(""))
                    return true;
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public static long CurrentTimeMilliSeconds()
        {
            return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            //static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, new System.Globalization.GregorianCalendar(), System.DateTimeKind.Utc);
            //return (DateTime.UtcNow.Ticks - Epoch.Ticks) / TimeSpan.TicksPerMillisecond;
        }
        public static long CurrentTimeMilliSecondsFrom(DateTime datetime)
        {
            return new DateTimeOffset(Convert.ToDateTime(datetime)).ToUniversalTime().ToUnixTimeMilliseconds();
        }
        public static long CurrentTimeMilliSecondsFrom(DateTime? datetime)
        {
            return new DateTimeOffset(Convert.ToDateTime(datetime)).ToUniversalTime().ToUnixTimeMilliseconds();
        }

        public static long CurrentTimeSeconds()
        {
            return new DateTimeOffset(Convert.ToDateTime(DateTime.Now)).ToUniversalTime().ToUnixTimeSeconds();
        }
        public static long CurrentTimeSecondsFrom(DateTime datetime)
        {
            try
            {
                return new DateTimeOffset(Convert.ToDateTime(datetime)).ToUniversalTime().ToUnixTimeSeconds();
            }
            catch (Exception)
            {
                return 0;
            }
        }
        public static long CurrentTimeSecondsFrom(DateTime? datetime)
        {
            try
            {
                return new DateTimeOffset(Convert.ToDateTime(datetime)).ToUniversalTime().ToUnixTimeSeconds();
            }
            catch (Exception)
            {
                return 0;
            }
        }
        public static long DateTimeToLong(DateTime _datetime)
        {
            try
            {
                return new DateTimeOffset(Convert.ToDateTime(_datetime)).ToUniversalTime().ToUnixTimeSeconds();
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public static DateTimeOffset CurrentTimeMilliSecondsRevert(long lTime)
        {
            return DateTimeOffset.FromUnixTimeSeconds(lTime).LocalDateTime;
            //static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, new System.Globalization.GregorianCalendar(), System.DateTimeKind.Utc);
            //return (DateTime.UtcNow.Ticks - Epoch.Ticks) / TimeSpan.TicksPerMillisecond;
        }
        public static DateTimeOffset CurrentTimeSecondsRevert(long lTime)
        {
            return DateTimeOffset.FromUnixTimeMilliseconds(lTime).LocalDateTime;
        }
        public static object[] OjbectNullToStringEmpty(object[] _object)
        {
            for (int i = 0; i < _object.Count(); i++)
            {
                if (_object[i] == null || _object[i] is null)
                    _object[i] = "";
            }
            return _object;
        }

        public static string left(string param, int length)
        {
            //we start at 0 since we want to get the characters starting from the
            //left and with the specified lenght and assign it to a variable
            string result = param.Substring(0, length);
            //return the result of the operation
            return result;
        }
        public static string right(string param, int length)
        {
            //start at the index based on the lenght of the sting minus
            //the specified lenght and assign it a variable
            string result = param.Substring(param.Length - length, length);
            //return the result of the operation
            return result;
        }
        public static string mid(string param, int startIndex, int length)
        {
            //start at the specified index in the string ang get N number of
            //characters depending on the lenght and assign it to a variable
            string result = param.Substring(startIndex, length);
            //return the result of the operation
            return result;
        }
        public static string mid(string param, int startIndex)
        {
            //start at the specified index and return all characters after it
            //and assign it to a variable
            string result = param.Substring(startIndex);
            //return the result of the operation
            return result;
        }
        public static string LeftCollapse(string param, int wordNumber)
        {
            //start at the specified index and return all characters after it and assign it to a variable, return the result of the operation
            if (string.IsNullOrEmpty(param))
                return "";

            //int countSpaces = param.Count(Char.IsWhiteSpace);
            string[] words = param.Split();
            //int countWords = param.Split().Length; // 7
            string result = "";
            int idex = words.Length - ((words.Length - wordNumber) < 0 ? 0 : (words.Length - wordNumber));
            for (int i = 0; i < words.Length && i < idex; i++)
            {
                result += words[i] + " ";
            }
            return ToSentenceCase(result.Trim());
        }
        public static string formatNumber(dynamic number, string digitGroupongSymbol, string decimalSymbol, int NoOfdigitsAfterDecimal)
        {
            try
            {
                Dictionary<dynamic, dynamic> dict = Utilities.Get_RegionSystem();
                string sDateFormat = dict["sDateFormat"];
                string sDigitGroup = dict["sDigitGroup"];
                string sDecimal = dict["sDecimal"];
                string _NoOfdigitsAfterDecimal = sDecimal + right("##################################################0", NoOfdigitsAfterDecimal);
                string _format = "{00:###" + sDigitGroup + "###" + sDigitGroup + "###" + _NoOfdigitsAfterDecimal + "}";
                string sFormat = string.Format(_format, number);

                if (sDigitGroup.Equals(digitGroupongSymbol.Trim()) && sDecimal.Equals(decimalSymbol.Trim()))
                    return sFormat;
                sFormat = sFormat.Replace(sDigitGroup, digitGroupongSymbol);

                if (sDecimal.Equals(decimalSymbol.Trim()))
                    return sFormat;


                int lastIndex = sFormat.LastIndexOf(sDecimal);
                string sFormat2 = "";
                for (int i = 0; i < sFormat.Length; i++)
                {
                    if (i == lastIndex)
                        sFormat2 += decimalSymbol;
                    else
                        sFormat2 += sFormat[i];
                }
                return sFormat2;
            }
            catch (Exception)
            {
                return number.ToString();
            }
        }

        public static string removeSpecialCharacter(string text)
        {
            string sResult = string.Empty;
            if (string.IsNullOrEmpty(text))
                return sResult;
            try
            {
                string[] specialCharacter = { "\\", "|", "!", "#", "$", "%", "&", "/", "(", ")", "=", "?", "»", "«", "@", "£", "§", "€", "{", "}", ".", "-", ";", "<", ">", "_", ",", ",", "  " };
                sResult = text;
                for (int i = 0; i < specialCharacter.Length; i++)
                {
                    sResult = sResult.Replace(specialCharacter[i], specialCharacter[i].Equals("@") ? "" : " ").Trim();
                }
                sResult = sResult.Trim();
            }
            catch (Exception)
            {
                sResult = string.Empty;
            }
            return sResult;
        }

        public static string ConvertHexStrToUnicode(string hexString)
        {
            try
            {
                int length = hexString.Length;
                byte[] bytes = new byte[length / 2];

                for (int i = 0; i < length; i += 2)
                {
                    bytes[i / 2] = Convert.ToByte(hexString.Substring(i, 2), 16);
                }
                return Encoding.UTF8.GetString(bytes);
            }
            catch (Exception)
            {
                return "";
            }

        }

        public static string convertToUnSign3(string s)
        {
            try
            {
                if (!string.IsNullOrEmpty(s))
                    s = s.Trim();
                Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
                string temp = s.Normalize(NormalizationForm.FormD);
                return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
            }
            catch (Exception)
            {
                return s;
            }

        }
        public static string convertToUnSign3(string s, char cFormat)
        {
            if (!string.IsNullOrEmpty(s))
                s = s.Trim();
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').Replace(' ', cFormat).ToLower();
        }
        public static string convertToUnSignSlug(string s)
        {
            if (!string.IsNullOrEmpty(s))
                s = s.Trim();
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').Replace(' ', '_').ToLower();
        }
        public static string GenerateSlug(string str, bool hierarchical = true)
        {
            if (!string.IsNullOrEmpty(str))
                str = str.Trim();
            var slug = str.ToLower();

            string[] decomposed = new string[] { "à","á","ạ","ả","ã","â","ầ","ấ","ậ","ẩ","ẫ","ă",
                                                    "ằ","ắ","ặ","ẳ","ẵ","è","é","ẹ","ẻ","ẽ","ê","ề" ,
                                                    "ế","ệ","ể","ễ", "ì","í","ị","ỉ","ĩ", "ò","ó","ọ",
                                                    "ỏ","õ","ô","ồ","ố","ộ","ổ","ỗ","ơ" ,"ò","ớ","ợ","ở",
                                                    "õ", "ù","ú","ụ","ủ","ũ","ư","ừ","ứ","ự","ử","ữ",
                                                    "ỳ","ý","ỵ","ỷ","ỹ", "đ",
                                                    "À","À","Ạ","Ả","Ã","Â","Ầ","Ấ","Ậ","Ẩ","Ẫ","Ă" ,
                                                    "Ằ","Ắ","Ặ","Ẳ","Ẵ", "È","É","Ẹ","Ẻ","Ẽ","Ê","Ề",
                                                    "Ế","Ệ","Ể","Ễ", "Ì","Í","Ị","Ỉ","Ĩ", "Ò","Ó","Ọ","Ỏ",
                                                    "Õ","Ô","Ồ","Ố","Ộ","Ổ","Ỗ","Ơ" ,"Ờ","Ớ","Ợ","Ở","Ỡ",
                                                    "Ù","Ú","Ụ","Ủ","Ũ","Ư","Ừ","Ứ","Ự","Ử","Ữ", "Ỳ","Ý","Ỵ",
                                                    "Ỷ","Ỹ", "Đ"};
            string[] precomposed =  {  "à","á","ạ","ả","ã","â","ầ","ấ","ậ","ẩ","ẫ","ă",
                                        "ằ","ắ","ặ","ẳ","ẵ","è","é","ẹ","ẻ","ẽ","ê","ề" ,
                                        "ế","ệ","ể","ễ", "ì","í","ị","ỉ","ĩ", "ò","ó","ọ","ỏ",
                                        "õ","ô","ồ","ố","ộ","ổ","ỗ","ơ" ,"ờ","ớ","ợ","ở","ỡ", "ù",
                                        "ú","ụ","ủ","ũ","ư","ừ","ứ","ự","ử","ữ", "ỳ","ý","ỵ","ỷ","ỹ",
                                        "đ", "À","Á","Ạ","Ả","Ã","Â","Ầ","Ấ","Ậ","Ẩ","Ẫ","Ă" ,"Ằ","Ắ",
                                        "Ặ","Ẳ","Ẵ", "È","É","Ẹ","Ẻ","Ẽ","Ê","Ề","Ế","Ệ","Ể","Ễ", "Ì",
                                        "Í","Ị","Ỉ","Ĩ", "Ò","Ó","Ọ","Ỏ","Õ","Ô","Ồ","Ố","Ộ","Ổ","Ỗ",
                                        "Ơ" ,"Ờ","Ớ","Ợ","Ở","Ỡ", "Ù","Ú","Ụ","Ủ","Ũ","Ư","Ừ","Ứ","Ự",
                                        "Ử","Ữ", "Ỳ","Ý","Ỵ","Ỷ","Ỹ", "Đ"};
            string[] latin =  { "a","a","a","a","a","a","a","a","a","a","a" ,
                                "a","a","a","a","a","a", "e","e","e","e","e",
                                "e","e","e","e","e","e", "i","i","i","i","i", "o",
                                "o","o","o","o","o","o","o","o","o","o","o" ,"o","o","o","o","o",
                                "u","u","u","u","u","u","u","u","u","u","u", "y","y","y","y","y", "d",
                                "a","a","a","a","a","a","a","a","a","a","a","a" ,"a","a","a","a","a",
                                "e","e","e","e","e","e","e","e","e","e","e", "i","i","i","i","i", "o",
                                "o","o","o","o","o","o","o","o","o","o","o" ,"o","o","o","o","o", "u",
                                "u","u","u","u","u","u","u","u","u","u", "y","y","y","y","y", "d"};

            // Convert culture specific characters
            for (int i = 0; i < decomposed.Length; i++)
            {
                slug = slug.Replace(decomposed[i], latin[i]);
                slug = slug.Replace(precomposed[i], latin[i]);
            }

            // Remove special characters
            slug = Regex.Replace(slug, @"[^a-z0-9-/ ]", "").Replace("--", "-");

            // Remove whitespaces
            slug = Regex.Replace(slug.Replace("-", " "), @"\s+", " ").Replace(" ", "-");

            // Remove slash if non-hierarchical
            if (!hierarchical)
                slug = slug.Replace("/", "-");

            // Remove multiple dashes
            slug = Regex.Replace(slug, @"[-]+", "-");

            // Remove leading & trailing dashes
            if (slug.EndsWith("-"))
                slug = slug.Substring(0, slug.LastIndexOf("-"));
            if (slug.StartsWith("-"))
                slug = slug.Substring(Math.Min(slug.IndexOf("-") + 1, slug.Length));
            return slug;
        }
        public static string getNewGuid(int len = 36)
        {
            string sNewGuid = string.Empty;
            try
            {
                string NewGuidId = System.Guid.NewGuid().ToString().ToUpper();
                sNewGuid = Utilities.right(NewGuidId, len);

            }
            catch (Exception)
            {
                sNewGuid = getRan(len);
            }
            return sNewGuid;
        }
        public static string getRan(int lenght = 10)
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[lenght];
            var random = new System.Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            var finalString = new String(stringChars);
            return finalString;
        }
        public static string getRanNumber(int lenght = 10)
        {
            var chars = "0123456789";
            var stringChars = new char[lenght];
            var random = new System.Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            var finalString = new String(stringChars);
            return finalString;
        }

        //FUNCTION

        public static void ChangDateToShortDate()
        {
            try
            {
                RegistryKey rkey = Registry.CurrentUser.OpenSubKey("Control Panel\\International", true);
                string sDateFormat = rkey.GetValue("sShortDate", 0).ToString().Trim();
                if (!sDateFormat.Trim().Equals("dd/MM/yyyy"))
                {
                    rkey.SetValue("sShortDate", "dd/MM/yyyy");
                    //rkey.Flush();
                }
            }
            catch (Exception)
            {
            }
        }

        public static bool Test_RegionSystem()
        {
            bool _NotOk = false;
            try
            {
                RegistryKey rkey = Registry.CurrentUser.OpenSubKey("Control Panel\\International", true);
                string sDateFormat = rkey.GetValue("sShortDate", 0).ToString().Trim();
                string sDecimal = rkey.GetValue("sDecimal", 0).ToString().Trim();
                string sDigitGroup = rkey.GetValue("sThousand", 0).ToString().Trim();
                if (sDateFormat != "dd/MM/yyyy")
                    _NotOk = true;
                if (sDecimal != ".")
                    _NotOk = true;
                if (sDigitGroup != ",")
                    _NotOk = true;
            }
            catch (Exception)
            {
                _NotOk = false;
            }
            return _NotOk;
        }
        public static Dictionary<dynamic, dynamic> Get_RegionSystem()
        {
            Dictionary<dynamic, dynamic> dict = new Dictionary<dynamic, dynamic>() { { "statusCode", 200 }, { "sDateFormat", "" }, { "sDigitGroup", "" }, { "sDecimal", "" } };
            try
            {
                RegistryKey rkey = Registry.CurrentUser.OpenSubKey("Control Panel\\International", true);
                string sDateFormat = rkey.GetValue("sShortDate", 0).ToString();  //" + Định dạng ngày hiện tại của hệ thống là (" + rkey.GetValue("sShortDate", 0) + ") --> Cần đổi lại về mặc định là (dd/MM/yyyy)";
                string sDigitGroup = rkey.GetValue("sThousand", 0).ToString(); //" + Ký tự phân biệt đơn vị, nghìn, triệu, tỷ... hiện tại của hệ thống là (" + rkey.GetValue("sThousand", 0) + ") --> Cần đổi lại về mặc định là dấu phẩy (.)";
                string sDecimal = rkey.GetValue("sDecimal", 0).ToString(); //" + Ký tự phân biệt phần thập phân hiện tại của hệ thống là (" + rkey.GetValue("sDecimal", 0) + ") --> Cần đổi lại về mặc định là dấu chấm (,)";
                dict["statusCode"] = 200;
                dict["sDateFormat"] = sDateFormat;
                dict["sDigitGroup"] = sDigitGroup;
                dict["sDecimal"] = sDecimal;
            }
            catch (Exception)
            {
                dict["statusCode"] = -1;
                dict["sDateFormat"] = "";
                dict["sDigitGroup"] = "";
                dict["sDecimal"] = "";
            }
            return dict;
        }
        public static void ChangFormatNumber(string sDateFormat = "dd/MM/yyyy", string sThousand = ",", string sDecimal = ".")
        {
            try
            {
                RegistryKey rkey = Registry.CurrentUser.OpenSubKey("Control Panel\\International", true);
                rkey.SetValue("sThousand", sThousand);
                rkey.SetValue("sDecimal", sDecimal);
                if (!sDateFormat.Trim().Equals("dd/MM/yyyy"))
                {
                    rkey.SetValue("sShortDate", "dd/MM/yyyy");
                    //rkey.Flush();
                }
            }
            catch (Exception) { }
        }

        public static string ToTitleCaseCulture(string sValue)
        {
            try
            {
                if (sValue.Trim().Length == 0) return "";
                TextInfo usaTextInfo = new CultureInfo("vi-VN", true).TextInfo;
                return usaTextInfo.ToTitleCase(sValue);

            }
            catch (Exception)
            {
                return "";
            }
        }
        public static string ToTitleCase(string sValue)
        {
            try
            {
                if (sValue.Trim().Length == 0) return "";
                TextInfo usaTextInfo = new CultureInfo("vi-VN", true).TextInfo;
                return usaTextInfo.ToTitleCase(sValue);

            }
            catch (Exception)
            {
                return "";
            }
        }
        public static string ToSentenceCase(string sValue)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(sValue))
                    return "";
                if (sValue.Trim().Length == 0) return "";
                string temp = sValue.ToLower().Trim();
                string valueReturn = "";
                bool isUpper = true;
                for (int i = 0; i < temp.Length; i++)
                {
                    if (isUpper)
                    {
                        valueReturn += temp[i].ToString().ToUpper();
                        isUpper = false;
                    }
                    else
                        valueReturn += temp[i].ToString().ToLower();
                    if (temp[i].ToString().Trim().Equals("."))
                        isUpper = true;
                }
                return valueReturn;

            }
            catch (Exception)
            {
                return "";
            }
        }
        public static string ToCamelCase(this string sValue)
        {
            try
            {
                if (sValue.Trim().Length == 0) return "";
                TextInfo txtInfo = new CultureInfo("en-us", true).TextInfo;
                sValue = sValue.Replace('_', ' ').Replace(" ", String.Empty);
                sValue = char.ToLowerInvariant(sValue[0]) + right(sValue, sValue.Length - 1);
                return sValue;
            }
            catch (Exception)
            {
                return "";
            }
        }
        public static List<string> ToList(string sValue, int numberWordStart)
        {
            List<string> arrlst = new List<string>();
            try
            {
                if (sValue.Trim().Length == 0)
                    return arrlst;
                string _sValue = sValue.ToLower().Trim();
                //_sValue.Replace(",", "").Replace(".", "").Replace(":", "").Replace(";", "").Replace("  ", " ");
                string[] arr = _sValue.Split(" ");

                string _temp1 = "", _temp2 = "";
                for (int i = 0; i < arr.Length; i++)
                {
                    _temp1 += arr[i] + " ";

                    if (i == arr.Length - 1 && arr.Length < numberWordStart)
                        arrlst.Add(_temp1);

                    if (i < numberWordStart - 1) continue;
                    for (int j = (arr.Length - (arr.Length - i)) + 1; j < arr.Length && arr.Length > numberWordStart; j++)
                    {
                        if (j == numberWordStart) continue;
                        _temp2 = arr[j];
                        arrlst.Add(_temp1 + _temp2);
                    }
                    if (i >= numberWordStart)
                        arrlst.Add(_temp1);

                }

            }
            catch (Exception)
            {
                return arrlst;
            }
            return arrlst;
        }
        public static ArrayList ToArrayList(string sValue, int numberWordStart)
        {
            ArrayList arrlst = new ArrayList();
            try
            {
                if (sValue.Trim().Length == 0)
                    return arrlst;
                string _sValue = sValue.ToLower().Trim();
                //_sValue.Replace(",", "").Replace(".", "").Replace(":", "").Replace(";", "").Replace("  ", " ");
                string[] arr = _sValue.Split(" ");

                string _temp1 = "", _temp2 = "";
                for (int i = 0; i < arr.Length; i++)
                {
                    _temp1 += arr[i] + " ";

                    if (i == arr.Length - 1 && arr.Length < numberWordStart)
                        arrlst.Add(_temp1);

                    if (i < numberWordStart - 1) continue;
                    for (int j = (arr.Length - (arr.Length - i)) + 1; j < arr.Length && arr.Length > numberWordStart; j++)
                    {
                        if (j == numberWordStart) continue;
                        _temp2 = arr[j];
                        arrlst.Add(_temp1 + _temp2);
                    }
                    if (i >= numberWordStart)
                        arrlst.Add(_temp1);
                }

            }
            catch (Exception)
            {
                return arrlst;
            }
            return arrlst;
        }
        public static string dictToString(Dictionary<dynamic, dynamic> dict)
        {
            //Dictionary<string, string> dict = new Dictionary<string, string>()
            //{
            //    {"key1", "value1" }, {"key2", "value2" }, {"key3", "value4" }
            //};
            JObject reqData = new JObject();
            foreach (var item in dict)
            {
                //reqData.Add(new JObject() { item.Key, item.Value });
                reqData.Add(new JProperty(item.Key, item.Value));
            }
            // Console.WriteLine(reqData.ToString());
            return reqData.ToString();
        }
        public static string dictToString(List<Dictionary<dynamic, dynamic>> lstdict)
        {
            if (lstdict.Count == 0)
                return "";
            JObject reqData = new JObject();
            foreach (var item in lstdict)
            {
                foreach (var item2 in item)
                {
                    //reqData.Add(new JObject() { item.Key, item.Value });
                    reqData.Add(new JProperty(item2.Key, item2.Value));
                }
            }

            // Console.WriteLine(reqData.ToString());
            return reqData.ToString();
        }
        public static string dictToJsonListString(Dictionary<dynamic, dynamic> dict, int limit)
        {
            //Dictionary<string, string> dict = new Dictionary<string, string>()
            //{
            //    {"Mã yêu cầu", "12345" }, {"Tổng tiền", "100000" }, {"Sản phẩm ĐQ", "50000" }, {"Sản phẩm khác", "20000" }, {"Dịch vụ", "30000" }
            //};
            StringBuilder sbuider = new StringBuilder();
            int i = 0;
            foreach (var item in dict)
            {
                //if (i == 0)sbuider.Append("{");
                //if (i > 0 && i % limit == 0)sbuider.Append("{");
                //sbuider.Append("\"key\":\"" + item.Key.ToString() + "\",\"value\":\"" + item.Value.ToString() + "\"");
                //if (i > 0 || i+1 % limit == 0)sbuider.Append("}");
                //if (i < (dict.Count - 1))sbuider.Append(",");
                //i++;
                sbuider.Append("{\"key\":\"" + item.Key.ToString() + "\",\"value\":\"" + item.Value.ToString() + "\"}");
                if (i < (dict.Count - 1))
                    sbuider.Append(",");
                i++;
            }
            return sbuider.ToString();
        }

        public static JObject convertStringJsonToJObject(string json)
        {
            JObject jObj = new JObject() { { "statusCode", "200" }, { "Message", "" } };
            try
            {
                var jObj2 = new JObject();
                if (json.Trim().Length > 0 && (json.Contains("{") && json.Contains("}")))
                    jObj2 = JsonConvert.DeserializeObject<JObject>(json);
                return jObj2;
            }
            catch (Exception ex)
            {
                jObj = new JObject() { { "statusCode", "-1" }, { "Message", ex.Message.ToString() } };
            }
            return jObj;
        }
        public static bool ContainsAny(string currentValue, IEnumerable<string> filterList)
        {
            return filterList.Any(currentValue.Contains);
        }

        public static List<string> splitString(string svalue, int limit)
        {
            List<string> lst = new List<string>();
            if (svalue.Trim().Length == 0)
                return lst;
            try
            {
                svalue = svalue.Replace(",", "");
                string[] _arr = svalue.Split(" ");
                string _temp = "";
                if (_arr.Length < limit)
                    lst.Add(svalue);
                else
                    for (int i = 0; i < _arr.Length; i++)
                    {
                        int k = 1;
                        _temp = _arr[i].Trim() + " ";
                        for (int j = i + 1; j < _arr.Length; j++)
                        {
                            if (k == limit) break;
                            _temp += _arr[j].Trim() + " ";
                            k++;
                        }
                        if (k < limit) continue;
                        lst.Add(_temp);
                    }
            }
            catch (Exception) { }
            return lst;
        }
        public static dynamic permutation(List<dynamic> list, bool isOutString)
        {
            dynamic result = null;
            Action<dynamic> permute = null;
            permute = (start) =>
            {
                if (start == list.Count)
                {
                    if (isOutString)
                        foreach (var item in list)
                            result += item + " ";
                    else
                        result = list;
                }
                else
                {
                    List<dynamic> swaps = new List<dynamic>();
                    for (int i = start; i < list.Count; i++)
                    {
                        if (swaps.Contains(list[i])) continue; // skip if we already done swap with this item
                        swaps.Add(list[i]);
                        Swap(ref list, start, i);
                        permute(start + 1);
                        Swap(ref list, start, i);
                    }
                }
            };

            permute(0);

            return result;
        }
        private static void Swap(ref List<dynamic> list, int i, int j)
        {
            dynamic temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }
    }
}
