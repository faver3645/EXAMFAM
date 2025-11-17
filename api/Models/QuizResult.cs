using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class QuizResult
    {
        public int QuizResultId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; } = null!;
        public int Score { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public int TimeUsedSeconds { get; set; }

        public List<QuizResultAnswer> Answers { get; set; } = new();
        
    }
}
