using System.ComponentModel.DataAnnotations;
using api.Validators;  

namespace api.DTOs
{
    public class QuestionDto
    {
        public int QuestionId { get; set; }

        [Required(ErrorMessage = "Question text is required.")]
        [StringLength(200, ErrorMessage = "Question text must be max 200 characters.")]
        public string Text { get; set; } = string.Empty;

        [ImageUrl] 
        public string? ImageUrl { get; set; }

        public List<AnswerOptionDto> AnswerOptions { get; set; } = new();
    }
}
