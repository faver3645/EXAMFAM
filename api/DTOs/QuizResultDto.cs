using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class QuizResultDto
    {
        public int QuizResultId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public int Score { get; set; }
        public int TotalQuestions { get; set; }

        public int TimeUsedSeconds { get; set; }
        public DateTime SubmittedAt { get; set; }


    }
}
