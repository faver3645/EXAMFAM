using System.ComponentModel.DataAnnotations;
namespace api.DTOs;

public class AnswerOptionDto
{
    public int AnswerOptionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}