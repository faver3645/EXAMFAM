using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class QuizResultDto
    {
        public int QuizResultId { get; set; }

        [Required(ErrorMessage = "The name is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "The name must be between 2 and 100 characters.")]
        public string UserName { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }

    }
}
