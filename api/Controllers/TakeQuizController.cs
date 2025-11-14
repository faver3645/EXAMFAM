using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.DAL;
using api.DTOs;
using api.Models;
using System.Security.Claims;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TakeQuizApiController : ControllerBase
    {
        private readonly IQuizRepository _repo;
        private readonly ILogger<TakeQuizApiController> _logger;

        public TakeQuizApiController(IQuizRepository repo, ILogger<TakeQuizApiController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        // Alle (Student/Teacher) kan se quizliste
        [AllowAnonymous]
        [HttpGet("takequizlist")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var quizzes = await _repo.GetAll();
            if (quizzes == null || !quizzes.Any())
                return NotFound("Quiz list not found");

            var quizDtos = quizzes.Select(q => new QuizDto
            {
                QuizId = q.QuizId,
                Title = q.Title
            }).ToList();

            return Ok(quizDtos);
        }

        // Hent spesifikk quiz (uten fasit)
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuiz(int id)
        {
            var quiz = await _repo.GetQuizById(id);
            if (quiz == null) return NotFound("Quiz not found");

            var quizDto = new QuizDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    Text = q.Text,
                    ImageUrl = q.ImageUrl,
                    AnswerOptions = q.AnswerOptions.Select(a => new AnswerOptionDto
                    {
                        AnswerOptionId = a.AnswerOptionId,
                        Text = a.Text
                    }).ToList()
                }).ToList()
            };

            return Ok(quizDto);
        }

        // Kun Student kan sende inn quizbesvarelse
        [Authorize(Roles = "Student")]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] QuizSubmissionDto submission)
        {
            var quiz = await _repo.GetQuizById(submission.QuizId);
            if (quiz == null) return NotFound("Quiz not found");

            int score = 0;
            foreach (var question in quiz.Questions)
            {
                if (submission.Answers.TryGetValue(question.QuestionId, out var selectedId))
                {
                    var correctOption = question.AnswerOptions.FirstOrDefault(a => a.IsCorrect);
                    if (correctOption != null && correctOption.AnswerOptionId == selectedId)
                        score++;
                }
            }

            // Endret til Dictionary
            return Ok(new Dictionary<string, int> { { "score", score } });
        }

        // Kun Student kan lagre egne forsøk – hent username fra token
        [Authorize(Roles = "Student")]
        [HttpPost("saveattempt")]
        public async Task<IActionResult> SaveAttempt([FromBody] QuizResultDto dto)
        {
            var quiz = await _repo.GetQuizById(dto.QuizId);
            if (quiz == null) return NotFound("Quiz not found");

            // Hent bruker fra token (sub-claim)
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "sub")?.Value;

            if (string.IsNullOrEmpty(userName))
                return Unauthorized("User not found in token.");

            var result = new QuizResult
            {
                QuizId = dto.QuizId,
                UserName = userName,
                Score = dto.Score
            };

            try
            {
                await _repo.AddResultAsync(result);
                return Ok(new { message = "Attempt saved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError("[TakeQuizApiController] SaveAttempt failed: {Message}", ex.Message);
                return StatusCode(500, "Failed to save attempt");
            }
        }

        // Hent forsøk – Teacher ser alle, Student kun egne
        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("attempts/{quizId}")]
        public async Task<IActionResult> GetAttempts(int quizId)
        {
            try
            {
                var results = await _repo.GetResultsForQuizAsync(quizId);

                if (results == null || !results.Any())
                    return Ok(new List<QuizResultDto>());

                var isTeacher = User.IsInRole("Teacher");
                var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "sub")?.Value;

                // Filtrer for student
                if (!isTeacher && !string.IsNullOrEmpty(userName))
                {
                    results = results.Where(r => r.UserName == userName).ToList();
                }

                var attemptsDto = results.Select(r => new QuizResultDto
                {
                    QuizResultId = r.QuizResultId,
                    UserName = r.UserName,
                    QuizId = r.QuizId,
                    QuizTitle = r.Quiz.Title,
                    Score = r.Score,
                    TotalQuestions = r.Quiz.Questions.Count
                }).ToList();

                return Ok(attemptsDto);
            }
            catch (Exception ex)
            {
                _logger.LogError("[TakeQuizApiController] GetAttempts({QuizId}) failed: {Message}", quizId, ex.Message);
                return StatusCode(500, "Failed to load attempts");
            }
        }

        // Kun Teacher kan slette forsøk
        [Authorize(Roles = "Teacher")]
        [HttpDelete("attempt/{attemptId}")]
        public async Task<IActionResult> DeleteAttempt(int attemptId)
        {
            try
            {
                await _repo.DeleteAttemptAsync(attemptId);
                return Ok(new { message = "Attempt deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError("[TakeQuizApiController] DeleteAttempt({AttemptId}) failed: {Message}", attemptId, ex.Message);
                return StatusCode(500, "Failed to delete attempt");
            }
        }
    }
}
