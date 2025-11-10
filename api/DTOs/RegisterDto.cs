using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(Student|Teacher)$", ErrorMessage = "Role must be either 'Student' or 'Teacher'")]
        public string Role { get; set; } = "Student";
    }
}
