using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace api.Validators
{
    public class ImageUrlAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null) return ValidationResult.Success;

            var url = value.ToString();
            if (string.IsNullOrWhiteSpace(url)) return ValidationResult.Success;

            var regex = new Regex(
                @"^(\/images\/[\w\-.]+\.(jpg|jpeg|png|gif)|https?:\/\/[\w\-.]+(\.[\w\-.]+)+.*\.(jpg|jpeg|png|gif))$",
                RegexOptions.IgnoreCase
            );

            if (!regex.IsMatch(url))
                return new ValidationResult("Image URL must be valid and end with .jpg, .jpeg, .png, or .gif");

            if (url.StartsWith("/images/"))
            {
                var webHostEnvironment = (IWebHostEnvironment?)validationContext
                    .GetService(typeof(IWebHostEnvironment));
                
                if (webHostEnvironment == null)
                {
                    return new ValidationResult("Unable to validate local image path: IWebHostEnvironment not available.");
                }

                var filePath = Path.Combine(webHostEnvironment.WebRootPath, url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

                if (!File.Exists(filePath))
                {
                    return new ValidationResult($"File does not exist on server: {url}");
                }
            }

            return ValidationResult.Success;
        }
    }
}
