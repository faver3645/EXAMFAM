namespace ITPE3200FAM.Models;


public class QuizResult
{
    public int QuizResultId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;
    public int Score { get; set; }
}