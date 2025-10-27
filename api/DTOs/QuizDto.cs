using System.ComponentModel.DataAnnotations;
namespace api.DTOs;


public class QuizDto
{
    public int QuizId { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<QuestionDto> Questions { get; set; } = new();
}