using System.ComponentModel.DataAnnotations;

namespace api.Models
{
     public class QuizResultAnswer
    {
        public int QuizResultAnswerId { get; set; }
        public int QuizResultId { get; set; }
        public QuizResult QuizResult { get; set; } = null!;
        public int QuestionId { get; set; }
        public int AnswerOptionId { get; set; }
    }
}