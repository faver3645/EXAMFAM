using System.ComponentModel.DataAnnotations;
namespace ITPE3200FAM.Models;


public class Question
{
    public int QuestionId { get; set; }

    [Required(ErrorMessage = "Question text is required.")]
    [StringLength(200, ErrorMessage = "Question text must be max 200 characters.")]
    public string Text { get; set; } = string.Empty;
    public int QuizId { get; set; }
    public List<AnswerOption> AnswerOptions { get; set; } = new();
}