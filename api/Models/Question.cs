using System.ComponentModel.DataAnnotations;
using api.Validators;  

namespace api.Models
{
    public class Question
    {
        public int QuestionId { get; set; }

        [Required(ErrorMessage = "Question text is required.")]
        [StringLength(200, ErrorMessage = "Question text must be max 200 characters.")]
        public string Text { get; set; } = string.Empty;

        [ImageUrl] 
        public string? ImageUrl { get; set; }

        public int QuizId { get; set; }

        public List<AnswerOption> AnswerOptions { get; set; } = new();
    }
}
