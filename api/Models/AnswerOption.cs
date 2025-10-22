using System.ComponentModel.DataAnnotations;
namespace ITPE3200FAM.Models;

public class AnswerOption
{
    public int AnswerOptionId { get; set; }

    [Required(ErrorMessage = "Answer text is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Answer text must be between 1 and 200 characters.")]
    [Display(Name = "Answer Text")]
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int QuestionId { get; set; }
}