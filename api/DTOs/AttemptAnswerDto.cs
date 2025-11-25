using System.ComponentModel.DataAnnotations;
namespace api.DTOs;

public class AttemptAnswerDto
{
    public int QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public List<AnswerOptionDtoExtended> AnswerOptions { get; set; } = new();
}