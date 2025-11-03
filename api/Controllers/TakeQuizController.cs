using Microsoft.AspNetCore.Mvc;
using api.DAL;
using api.DTOs;
using api.Models;

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

        // 🔹 Hent liste av alle quizer
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

        // 🔹 Hent en quiz med spørsmål og svaralternativer
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuiz(int id)
        {
            var quiz = await _repo.GetQuizById(id);
            if (quiz == null)
            {
                _logger.LogWarning("[TakeQuizApiController] Quiz {Id} not found", id);
                return NotFound("Quiz not found");
            }

            var quizDto = new QuizDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    Text = q.Text,
                    AnswerOptions = q.AnswerOptions.Select(a => new AnswerOptionDto
                    {
                        AnswerOptionId = a.AnswerOptionId,
                        Text = a.Text
                    }).ToList()
                }).ToList()
            };

            return Ok(quizDto);
        }

        // 🔹 Submit quiz-svar (uten å lagre forsøk)
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

            return Ok(new { score });
        }

        // 🔹 Save attempt når brukeren trykker "Save Attempt"
        [HttpPost("saveattempt")]
        public async Task<IActionResult> SaveAttempt([FromBody] QuizResultDto dto)
        {
            var quiz = await _repo.GetQuizById(dto.QuizId);
            if (quiz == null) return NotFound("Quiz not found");

            var result = new QuizResult
            {
                QuizId = dto.QuizId,
                UserName = dto.UserName,
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

        // 🔹 Hent alle forsøk for en quiz (API for React)
        [HttpGet("attempts/{quizId}")]
        public async Task<IActionResult> GetAttempts(int quizId)
        {
            try
            {
                var results = await _repo.GetResultsForQuizAsync(quizId);

                if (results == null || !results.Any())
                    return Ok(new List<QuizResultDto>());

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
    }
}
