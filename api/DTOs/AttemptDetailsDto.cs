using System.ComponentModel.DataAnnotations;
namespace api.DTOs;

public class AttemptDetailsDto
{
    public int QuizResultId { get; set; }
    public int QuizId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int TimeSpent { get; set; } // fra TimeUsedSeconds
    public double Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }

    public List<AttemptAnswerDto> Questions { get; set; } = new();
}