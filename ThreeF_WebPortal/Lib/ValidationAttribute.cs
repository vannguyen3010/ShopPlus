using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;

namespace ThreeF_WebPortal.ExtensionMethods
{
    public static class ValidationAttribute
    {
        public class MaxFileSizeAttribute : System.ComponentModel.DataAnnotations.ValidationAttribute
        {
            private readonly int _maxFileSize;
            private readonly string _errorMessage;
            public MaxFileSizeAttribute(int maxFileSize, string errorMessage = "")
            {
                _maxFileSize = maxFileSize;
                _errorMessage = errorMessage;
            }

            protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
            {
                var file = value as IFormFile;
                if (file != null)
                {
                    if (file.Length > _maxFileSize)
                    {
                        return new ValidationResult(GetErrorMessage());
                    }
                }

                return ValidationResult.Success;
            }

            public string GetErrorMessage()
            {
                return string.IsNullOrEmpty(_errorMessage) ? $"Maximum allowed file size is {_maxFileSize} bytes." : _errorMessage;
            }
        }
        public class MaxFileSizeInListAttribute : System.ComponentModel.DataAnnotations.ValidationAttribute
        {
            private readonly int _maxFileSize;
            private readonly string _errorMessage;
            public MaxFileSizeInListAttribute(int maxFileSize, string errorMessage = "")
            {
                _maxFileSize = maxFileSize;
                _errorMessage = errorMessage;
            }

            protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
            {
                var file = value as List<IFormFile>;
                if (file != null)
                    for (int i = 0; i < file.Count; i++)
                        if (file[i] != null && file[i].Length > _maxFileSize)
                            return new ValidationResult(GetErrorMessage());
                return ValidationResult.Success;
            }

            public string GetErrorMessage()
            {
                return string.IsNullOrEmpty(_errorMessage) ? $"Maximum allowed file size is {_maxFileSize} bytes." : _errorMessage;
            }
        }
        public class AllowedExtensionsAttribute : System.ComponentModel.DataAnnotations.ValidationAttribute
        {
            private readonly string[] _extensions;
            private readonly string _errorMessage;
            public AllowedExtensionsAttribute(string[] extensions, string errorMessage = "")
            {
                _extensions = extensions;
                _errorMessage = errorMessage;
            }

            protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
            {
                var file = value as IFormFile;
                if (file != null)
                {
                    var extension = Path.GetExtension(file.FileName);
                    if (!_extensions.Contains(extension.ToLower()))
                    {
                        return new ValidationResult(GetErrorMessage());
                    }
                }

                return ValidationResult.Success;
            }

            public string GetErrorMessage()
            {
                return string.IsNullOrEmpty(_errorMessage) ? $"This photo extension is not allowed!" : _errorMessage;
            }
        }
        public class AllowedExtensionsInListAttribute : System.ComponentModel.DataAnnotations.ValidationAttribute
        {
            private readonly string[] _extensions;
            private readonly string _errorMessage;
            public AllowedExtensionsInListAttribute(string[] extensions, string errorMessage = "")
            {
                _extensions = extensions;
                _errorMessage = errorMessage;
            }

            protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
            {
                var file = value as List<IFormFile>;
                if (file != null)
                    for (int i = 0; i < file.Count; i++)
                        if (file[i] != null)
                        {
                            var extension = Path.GetExtension(file[i].FileName);
                            if (!_extensions.Contains(extension.ToLower()))
                                return new ValidationResult(GetErrorMessage());
                        }

                return ValidationResult.Success;
            }

            public string GetErrorMessage()
            {
                return string.IsNullOrEmpty(_errorMessage) ? $"This photo extension is not allowed!" : _errorMessage;
            }
        }
        public class MaxFileAttribute : System.ComponentModel.DataAnnotations.ValidationAttribute
        {
            private readonly int _maxFile;
            private readonly string _errorMessage;
            public MaxFileAttribute(int maxFile, string errorMessage = "")
            {
                _maxFile = maxFile;
                _errorMessage = errorMessage;
            }

            protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
            {
                var file = value as List<IFormFile>;
                if (file != null && file.Count > _maxFile)
                    return new ValidationResult(GetErrorMessage());

                return ValidationResult.Success;
            }

            public string GetErrorMessage()
            {
                return string.IsNullOrEmpty(_errorMessage) ? $"Maximum allowed file is {_maxFile}." : _errorMessage;
            }
        }
    }
}
