using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace api.Validators
{
    public class ImageUrlAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null) return ValidationResult.Success;

            var url = value.ToString();
            if (string.IsNullOrWhiteSpace(url)) return ValidationResult.Success;

            // Regex for relative og full URL til bilder (jpg, jpeg, png, gif)
            var regex = new Regex(
                @"^(\/images\/[\w\-.]+|https?:\/\/[\w\-.]+(\.[\w\-.]+)+.*\.(jpg|jpeg|png|gif))$", 
                RegexOptions.IgnoreCase
            );

            if (!regex.IsMatch(url))
                return new ValidationResult("Image URL must be valid and end with .jpg, .jpeg, .png, or .gif");

            return ValidationResult.Success;
        }
    }
}
