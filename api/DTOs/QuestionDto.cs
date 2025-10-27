using System.ComponentModel.DataAnnotations;
namespace api.DTOs;


public class QuestionDto
{
    public string Text { get; set; } = string.Empty;
    public List<AnswerOptionDto> AnswerOptions { get; set; } = new();
}