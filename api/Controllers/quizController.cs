using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DAL;
using api.DTOs;
using Microsoft.Extensions.Logging;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizAPIController : ControllerBase
{
    private readonly IQuizRepository _repo;
    private readonly ILogger<QuizAPIController> _logger;

    public QuizAPIController(IQuizRepository repo, ILogger<QuizAPIController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    // Alle kan se quizliste
    [AllowAnonymous]
    [HttpGet("quizlist")]
    public async Task<IActionResult> QuizList()
    {
        var quizzes = await _repo.GetAll();
        if (quizzes == null)
        {
            _logger.LogError("[QuizAPIController] quiz list not found while executing _repo.GetAll()");
            return NotFound("quiz list not found");
        }

        var quizDtos = quizzes.Select(q => new QuizDto
        {
            QuizId = q.QuizId,
            Title = q.Title
        });

        return Ok(quizDtos);
    }

    // Kun lærere kan lage quiz
    [Authorize(Roles = "Teacher")]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] QuizDto quizDto)
    {
        if (quizDto == null)
            return BadRequest("Quiz cannot be null");

        var newQuiz = new Quiz
        {
            Title = quizDto.Title,
            Questions = quizDto.Questions.Select(q => new Question
            {
                Text = q.Text,
                ImageUrl = q.ImageUrl,
                AnswerOptions = q.AnswerOptions.Select(a => new AnswerOption
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList()
        };

        bool result = await _repo.Create(newQuiz);

        if (result)
            return CreatedAtAction(nameof(QuizList), new { id = newQuiz.QuizId }, newQuiz);

        _logger.LogWarning("[QuizAPIController] Quiz creation failed {@Quiz}", newQuiz);
        return StatusCode(500, "Internal server error");
    }

    // Alle kan hente enkeltquiz
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuiz(int id)
    {
        var quiz = await _repo.GetQuizById(id);
        if (quiz == null)
        {
            _logger.LogError("[QuizAPIController] Quiz not found for QuizId {QuizId:0000}", id);
            return NotFound("Quiz not found");
        }

        return Ok(quiz);
    }

    // Kun lærere kan oppdatere
    [Authorize(Roles = "Teacher")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizDto quizDto)
    {
        if (quizDto == null)
            return BadRequest("Quiz data cannot be null");

        var existingQuiz = await _repo.GetQuizById(id);
        if (existingQuiz == null)
        {
            _logger.LogWarning("[QuizAPIController] Quiz with id {Id} not found", id);
            return NotFound($"Quiz with id {id} not found");
        }

        existingQuiz.Title = quizDto.Title;
        existingQuiz.Questions = quizDto.Questions?.Select(q => new Question
        {
            Text = q.Text,
            ImageUrl = q.ImageUrl,
            AnswerOptions = q.AnswerOptions?.Select(a => new AnswerOption
            {
                Text = a.Text,
                IsCorrect = a.IsCorrect
            }).ToList() ?? new List<AnswerOption>()
        }).ToList() ?? new List<Question>();

        bool result = await _repo.Update(existingQuiz);
        if (result)
            return Ok(existingQuiz);

        _logger.LogError("[QuizAPIController] Failed to update quiz {@Quiz}", existingQuiz);
        return StatusCode(500, "Internal server error while updating quiz");
    }

    // Kun lærere kan slette
    [Authorize(Roles = "Teacher")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool deleted = await _repo.Delete(id);
        if (!deleted)
        {
            _logger.LogError("[QuizAPIController] Quiz deletion failed for QuizId {QuizId:0000}", id);
            return BadRequest("Quiz deletion failed");
        }
        return NoContent();
    }
}
