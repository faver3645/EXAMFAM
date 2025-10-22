using System.ComponentModel.DataAnnotations;
namespace ITPE3200FAM.Models;


public class Quiz
{
    public int QuizId { get; set; }

    [Required(ErrorMessage = "The Title is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "The Title must be between 2 and 100 characters.")]
    [Display(Name = "Quiz Title")]
    public string Title { get; set; } = string.Empty;
    public List<Question> Questions { get; set; } = new();
}