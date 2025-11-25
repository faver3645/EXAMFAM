using System.ComponentModel.DataAnnotations;
namespace api.DTOs;

public class AnswerOptionDtoExtended : AnswerOptionDto
{
    public bool Selected { get; set; } = false;
}