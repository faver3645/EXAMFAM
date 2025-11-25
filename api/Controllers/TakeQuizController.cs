using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.DAL;
using api.DTOs;
using api.Models;
using api.Query;
using System.Security.Claims;
using System.IO;

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

        // Endpoint for å validere bilde-URL (lokal fil)
        [AllowAnonymous]
        [HttpGet("validateimage")]
        public IActionResult ValidateImage([FromQuery] string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return Ok(new { valid = true });

            if (!imageUrl.StartsWith("/images/"))
                return Ok(new { valid = true }); // kun lokale bilder sjekkes

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (!System.IO.File.Exists(filePath))
                return Ok(new { valid = false, message = $"Image '{imageUrl}' does not exist on server." });

            return Ok(new { valid = true });
        }

        // Student sender inn svar for poengberegning
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

            return Ok(new Dictionary<string, int> { { "score", score } });
        }

        // Student lagrer eget forsøk
        [Authorize(Roles = "Student")]
        [HttpPost("saveattempt")]
        public async Task<IActionResult> SaveAttempt([FromBody] QuizResultDto dto)
        {
            var quiz = await _repo.GetQuizById(dto.QuizId);
            if (quiz == null) return NotFound("Quiz not found");

            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "sub")?.Value;
            if (string.IsNullOrEmpty(userName))
                return Unauthorized("User not found in token.");

            var result = new QuizResult
            {
                QuizId = dto.QuizId,
                UserName = userName,
                Score = dto.Score,
                TimeUsedSeconds = dto.TimeUsedSeconds,
                SubmittedAt = DateTime.UtcNow,
                Answers = dto.Answers.Select(a => new QuizResultAnswer
                {
                    QuestionId = a.Key,
                    AnswerOptionId = a.Value
                }).ToList()
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

        // Teacher kan se alle – Student kun egne. Nå med filter/sort/paging.
        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("attempts/{quizId}")]
        public async Task<IActionResult> GetAttempts(int quizId, [FromQuery] AttemptsQueryParams query)
        {
            try
            {
                var (results, totalCount) = await _repo.GetResultsForQuizAsync(quizId, query);

                if (results == null)
                    return Ok(new { data = new List<QuizResultDto>(), total = 0 });

                var isTeacher = User.IsInRole("Teacher");
                var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "sub")?.Value;

                // Student får kun egne
                if (!isTeacher && !string.IsNullOrEmpty(userName))
                {
                    results = results.Where(r => r.UserName == userName);
                    totalCount = results.Count();
                }

                // Norsk tidssone
                var tz = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");

                var dtoList = results.Select(r => new QuizResultDto
                {
                    QuizResultId = r.QuizResultId,
                    UserName = r.UserName,
                    QuizId = r.QuizId,
                    QuizTitle = r.Quiz.Title,
                    Score = r.Score,
                    TotalQuestions = r.Quiz.Questions.Count,
                    TimeUsedSeconds = r.TimeUsedSeconds,
                    SubmittedAt = TimeZoneInfo.ConvertTimeFromUtc(r.SubmittedAt, tz),
                    Answers = r.Answers.ToDictionary(a => a.QuestionId, a => a.AnswerOptionId)
                }).ToList();

                return Ok(new
                {
                    data = dtoList,
                    total = totalCount,
                    page = query.Page,
                    pageSize = query.PageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("[TakeQuizApiController] GetAttempts({QuizId}) failed: {Message}", quizId, ex.Message);
                return StatusCode(500, "Failed to load attempts");
            }
        }

        // Teacher kan slette forsøk
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

        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("attempt-details/{attemptId}")]
        public async Task<IActionResult> GetAttemptDetails(int attemptId)
        {
            var attempt = await _repo.GetResultByIdAsync(attemptId);
            if (attempt == null) return NotFound("Attempt not found");

            var isTeacher = User.IsInRole("Teacher");
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "sub")?.Value;

            // Student kan kun se sitt eget forsøk
            if (!isTeacher && attempt.UserName != userName)
                return Forbid();

            var totalQuestions = attempt.Quiz.Questions.Count;
            var correctAnswers = attempt.Answers.Count(a =>
                attempt.Quiz.Questions
                    .First(q => q.QuestionId == a.QuestionId)
                    .AnswerOptions
                    .First(ao => ao.AnswerOptionId == a.AnswerOptionId)
                    .IsCorrect
            );

            // Mapper alle spørsmål til AttemptAnswerDto med alternativer og selected-flag
            var questionsDto = attempt.Quiz.Questions.Select(q => new AttemptAnswerDto
            {
                QuestionId = q.QuestionId,
                Text = q.Text,
                ImageUrl = q.ImageUrl,
                AnswerOptions = q.AnswerOptions.Select(a => new AnswerOptionDtoExtended
                {
                    AnswerOptionId = a.AnswerOptionId,
                    Text = a.Text,
                    IsCorrect = a.IsCorrect,
                    Selected = attempt.Answers.Any(ans => ans.QuestionId == q.QuestionId && ans.AnswerOptionId == a.AnswerOptionId)
                }).ToList()
            }).ToList();

            var dto = new AttemptDetailsDto
            {
                QuizResultId = attempt.QuizResultId,
                QuizId = attempt.QuizId,
                UserName = attempt.UserName,
                SubmittedAt = attempt.SubmittedAt,
                TimeSpent = attempt.TimeUsedSeconds,
                Score = attempt.Score,
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctAnswers,
                Questions = questionsDto
            };

            return Ok(dto);
        }
    }
}
