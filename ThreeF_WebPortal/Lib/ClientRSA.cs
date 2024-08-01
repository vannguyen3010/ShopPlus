using ThreeF_WebPortal.Models;
using Org.BouncyCastle.Crypto; //1.9.0.0
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Security;
using System.Configuration;
using System.Security.Cryptography;

namespace ThreeF_WebPortal.Lib
{
    public static class ClientRSA
    {
        public static async Task<(int result, string data)> RSAEncryptPemKeyAuth(string pubKey, string plainText)
        {
            //, bool cypherTextToBase64 = false
            (int result, string data) a = (1, "");
            if (string.IsNullOrEmpty(pubKey) || string.IsNullOrEmpty(plainText))
            {
                a.result = 0;
                a.data = "pubKey hoặc plainText không được để trống";
            }
            var cypherText = Client_RSA_Algorithm.RSAEncryptPem(plainText, pubKey);
            //if (cypherTextToBase64)
            //{
            //    //int cypherLenght = cypherText.Length;
            //    //int bufferLenght = ((cypherLenght * 3) + 3) / 4 - (cypherLenght > 0 && cypherText[cypherLenght - 1] == '=' ? (cypherLenght > 1 && cypherText[cypherLenght - 2] == '=') ? 2 : 1 : 0);
            //    //byte[] buffer = new byte[bufferLenght];
            //    //Convert.TryFromBase64String(cypherText, buffer, out var byteBase64);
            //    var byteBase64 = Encoding.UTF8.GetBytes(cypherText);
            //    cypherText = Convert.ToBase64String(byteBase64);
            //}
            a.data = cypherText;
            return await Task.Run(() => a);
        }

        public static async Task<(int result, string data)> RSAEncryptXMLKeyAuth(string pubKey, string plainText)
        {
            //, bool cypherTextToBase64 = false
            (int result, string data) a = (1, "");
            if (string.IsNullOrEmpty(pubKey) || string.IsNullOrEmpty(plainText))
            {
                a.result = 0;
                a.data = "pubKey hoặc plainText không được để trống";
            }
            var cypherText = Client_RSA_Algorithm.RSAEncryptXML(plainText, pubKey);
            //if (cypherTextToBase64)
            //{
            //    //int cypherLenght = cypherText.Length;
            //    //int bufferLenght = ((cypherLenght * 3) + 3) / 4 - (cypherLenght > 0 && cypherText[cypherLenght - 1] == '=' ? (cypherLenght > 1 && cypherText[cypherLenght - 2] == '=') ? 2 : 1 : 0);
            //    //byte[] buffer = new byte[bufferLenght];
            //    //Convert.TryFromBase64String(cypherText, buffer, out var byteBase64);
            //    var byteBase64 = Encoding.UTF8.GetBytes(cypherText);
            //    cypherText = Convert.ToBase64String(byteBase64);
            //}
            a.data = cypherText;
            return await Task.Run(() => a);
        }
    }

    public static class Client_RSA_Algorithm
    {
        public static string RSAEncryptXML(string plainText, string pubKey)
        {
            string cypherText = string.Empty;
            try
            {
                RSAParameters rsaPubKey = getRSAKeyFromXML(pubKey);
                var bytesPlainTextData = System.Text.Encoding.Unicode.GetBytes(plainText); //for encryption, always handle bytes...
                RSACryptoServiceProvider csp = new RSACryptoServiceProvider();
                csp.ImportParameters(rsaPubKey);
                var bytesCypherText = csp.Encrypt(bytesPlainTextData, false);//apply pkcs#1.5 padding and encrypt our data  
                cypherText = Convert.ToBase64String(bytesCypherText); //we might want a string representation of our cypher text... base64 will do
            }
            catch (Exception ex)
            {
                //System.Windows.Forms.MessageBox.Show(ex.Message);
                Console.WriteLine(ex.Message);
            }
            return cypherText;
        }
        public static string RSAEncryptPem(string plainText, string pubKey)
        {
            string cypherText = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(pubKey))
                    return plainText;
                RSACryptoServiceProvider csp = ImportPublicKey(pubKey);
                var bytesPlainTextData = System.Text.Encoding.Unicode.GetBytes(plainText); //for encryption, always handle bytes...

                var bytesCypherText = csp.Encrypt(bytesPlainTextData, false);//apply pkcs#1.5 padding and encrypt our data  
                cypherText = Convert.ToBase64String(bytesCypherText); //we might want a string representation of our cypher text... base64 will do
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return cypherText;
        }

        public static RSAParameters getRSAKeyFromXML(string KeyString)
        {
            //converting it back
            {
                var sr = new System.IO.StringReader(KeyString);  //get a stream from the string
                var xs = new System.Xml.Serialization.XmlSerializer(typeof(RSAParameters)); //we need a deserializer
                return (RSAParameters)xs.Deserialize(sr); //get the object back from the stream
            }
        }

        /// <summary>
        /// Import OpenSSH PEM public key string into MS RSACryptoServiceProvider
        /// </summary>
        /// <param name="pem"></param>
        /// <returns></returns>
        public static RSACryptoServiceProvider ImportPublicKey(string pem)
        {
            PemReader pr = new PemReader(new StringReader(pem));
            AsymmetricKeyParameter publicKey = (AsymmetricKeyParameter)pr.ReadObject();
            RSAParameters rsaParams = DotNetUtilities.ToRSAParameters((RsaKeyParameters)publicKey);

            RSACryptoServiceProvider csp = new RSACryptoServiceProvider();// cspParams);
            csp.ImportParameters(rsaParams);
            return csp;
        }
    }

    public static class Utility
    {
        public static string StringtoNumber(string s)
        {
            try
            {
                char[] Numbers = s.ToCharArray();
                string numString = "";
                for (int i = 0; i < Numbers.Length; i++)
                    numString += "-" + ((int)Numbers[i]).ToString();
                return numString.Substring(1); ;
            }
            catch (Exception)
            {
                return "";
            }

        }
        public static string NumberToString(string s)
        {
            try
            {
                char[] keyCode_ = s.ToCharArray();

                string info = "";
                for (int i = 0; i < keyCode_.Length; i++)
                    info += ((char)Convert.ToInt32(keyCode_[i])).ToString();
                return info;
            }
            catch (Exception)
            {
                return "";
            }
        }
        public static string NumberToString(string s, string delimiter)
        {
            try
            {
                string[] keyCode_ = s.Split(delimiter);

                string info = "";
                for (int i = 0; i < keyCode_.Length; i++)
                    info += ((char)Convert.ToInt32(keyCode_[i])).ToString();
                return info;
            }
            catch (Exception)
            {
                return "";
            }
        }
        public static string NumberToString(char[] arr)
        {
            try
            {
                char[] keyCode_ = arr;

                string info = "";
                for (int i = 0; i < keyCode_.Length; i++)
                    info += ((char)Convert.ToInt32(keyCode_[i])).ToString();
                return info;
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static string ReConfigureTokenTime(Config_TokenUploadFile config, string sctlc, string setlc, string cs, int seconds)
        {
            try
            {
                if (string.IsNullOrEmpty(setlc)) return string.Empty;

                var serverExpiredTimeLongCypher = NumberToString(setlc, "-");
                if (string.IsNullOrEmpty(serverExpiredTimeLongCypher)) return string.Empty;

                long lExpiredTime = Convert.ToInt64(serverExpiredTimeLongCypher);

                var setl = DateTimeOffset.FromUnixTimeSeconds(lExpiredTime).LocalDateTime;
                //Server Clocksew
                var serverClockSkew = string.IsNullOrEmpty(cs) ? 0 : Convert.ToInt32(cs);
                if (setl <= DateTime.Now.AddSeconds(serverClockSkew))
                    setl = setl.AddSeconds(serverClockSkew);

                var expiredTime = setl.AddSeconds(seconds);
                var expiredTimeLong = new DateTimeOffset(Convert.ToDateTime(expiredTime)).ToUniversalTime().ToUnixTimeSeconds();

                //s = $"Time:{expiredTimeLong};sType:PEM;authId:1"; 
                return StringtoNumber($"Time:{expiredTimeLong};keyShareType:{config.keyShareType};authId:{config.authId}") + $";data:{config.userKeyShare}";
            }
            catch (Exception)
            {
                return String.Empty;
            }
        }
    }
}
