using System.ComponentModel.DataAnnotations;
namespace api.DTOs;

public class AnswerOptionDto
{
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}