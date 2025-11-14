using System.ComponentModel.DataAnnotations;
namespace api.DTOs;


public class QuestionDto
{
    public int QuestionId { get; set; }

    [Required(ErrorMessage = "Question text is required.")]
    [StringLength(200, ErrorMessage = "Question text must be max 200 characters.")]
    public string Text { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public List<AnswerOptionDto> AnswerOptions { get; set; } = new();
}