using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace ThreeF_WebPortal.Lib
{
    public class ImageHelper
    {
        public static StreamContent EncodeToStreamContent(IFormFile imgFile)
        {
            try
            {
                using (var ms = new MemoryStream())
                {
                    imgFile.OpenReadStream().CopyTo(ms);
                    byte[] filteBytes = ms.ToArray();
                    return new StreamContent(new MemoryStream(filteBytes));
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        public static string EncodeToBase64String(IFormFile imgFile)
        {
            try
            {
                using (var ms = new MemoryStream())
                {
                    imgFile.OpenReadStream().CopyTo(ms);
                    byte[] filteBytes = ms.ToArray();
                    return Convert.ToBase64String(filteBytes);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        public enum ImageFormat
        {
            bmp,
            jpg,
            jpeg,
            gif,
            tiff,
            png,
            unknown
        }
        private enum ImageFileExtension
        {
            none = 0,
            jpg = 1,
            jpeg = 2,
            bmp = 3,
            gif = 4,
            png = 5
        }
        public enum FileType
        {
            Image = 1,
            Video = 2,
            PDF = 3,
            Text = 4,
            DOC = 5,
            DOCX = 6,
            PPT = 7,
        }
        public static bool ValidationImage(IFormFile file, int maximumSize)
        {
            bool isValidation = false;
            if (file.Length > 0 && file.Length < maximumSize)
            {
                byte[] tempFileByte = new byte[file.Length];
                var result = isValidImageFile(tempFileByte);
                if (result == ImageFormat.jpg || result == ImageFormat.png)
                    isValidation = true;
            }
            return isValidation;
        }
        public static ImageFormat isValidImageFile(byte[] bytes)
        {
            // see http://www.mikekunz.com/image_file_header.html  
            var bmp = Encoding.ASCII.GetBytes("BM");     // BMP
            var gif = Encoding.ASCII.GetBytes("GIF");    // GIF
            var png = new byte[] { 137, 80, 78, 71 };    // PNG
            var tiff = new byte[] { 73, 73, 42 };         // TIFF
            var tiff2 = new byte[] { 77, 77, 42 };         // TIFF
            var jpg = new byte[] { 255, 216, 255, 224 }; // jpeg
            var jpeg2 = new byte[] { 255, 216, 255, 225 }; // jpeg canon

            if (bmp.SequenceEqual(bytes.Take(bmp.Length)))
                return ImageFormat.bmp;

            if (gif.SequenceEqual(bytes.Take(gif.Length)))
                return ImageFormat.gif;

            if (png.SequenceEqual(bytes.Take(png.Length)))
                return ImageFormat.png;

            if (tiff.SequenceEqual(bytes.Take(tiff.Length)))
                return ImageFormat.tiff;

            if (tiff2.SequenceEqual(bytes.Take(tiff2.Length)))
                return ImageFormat.tiff;

            if (jpg.SequenceEqual(bytes.Take(jpg.Length)))
                return ImageFormat.jpg;

            if (jpeg2.SequenceEqual(bytes.Take(jpeg2.Length)))
                return ImageFormat.jpeg;

            return ImageFormat.unknown;
        }
    }
}
