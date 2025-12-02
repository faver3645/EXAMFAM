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

        
        [AllowAnonymous]
        [HttpGet("takequizlist")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var quizzes = await _repo.GetAll();
            if (quizzes == null || !quizzes.Any())
            {
                 _logger.LogError("[TakeQuizAPIController] quiz list not found while executing _repo.GetAll()");
                return NotFound("Quiz list not found");
            }
        
            var quizDtos = quizzes.Select(q => new QuizDto
            {
                QuizId = q.QuizId,
                Title = q.Title
            }).ToList();

            return Ok(quizDtos);
        }

        
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuiz(int id)
        {
            var quiz = await _repo.GetQuizById(id);
            if (quiz == null)
            {
                _logger.LogError("[TakeQuizAPIController] Quiz not found for QuizId {QuizId:0000}", id);
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

        // validate image URL
        [AllowAnonymous]
        [HttpGet("validateimage")]
        public IActionResult ValidateImage([FromQuery] string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return Ok(new { valid = true });

            if (!imageUrl.StartsWith("/images/"))
                return Ok(new { valid = true }); 

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (!System.IO.File.Exists(filePath))
                return Ok(new { valid = false, message = $"Image '{imageUrl}' does not exist on server." });

            return Ok(new { valid = true });
        }

        // students submit quiz for scoring
        [Authorize(Roles = "Student")]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] QuizSubmissionDto submission)
        {
            var quiz = await _repo.GetQuizById(submission.QuizId);
            if (quiz == null)
            {
                _logger.LogError("[TakeQuizAPIController] Quiz not found for QuizId {QuizId:0000}", submission.QuizId);
                return NotFound("Quiz not found");  
            } 

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

        // Students save quiz attempt
        [Authorize(Roles = "Student")]
        [HttpPost("saveattempt")]
        public async Task<IActionResult> SaveAttempt([FromBody] QuizResultDto dto)
        {
            var quiz = await _repo.GetQuizById(dto.QuizId);
            if (quiz == null)
            { 
                _logger.LogError("[TakeQuizAPIController] Quiz not found for QuizId {QuizId:0000}", dto.QuizId);
                return NotFound("Quiz not found");
            } 

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

             bool saved = await _repo.AddResultAsync(result);

            if (!saved)
            {
                _logger.LogError(
                    "[TakeQuizApiController] Failed to save attempt for User {UserName} on QuizId {QuizId:0000}", 
                    userName, dto.QuizId
                );
                return StatusCode(500, "Failed to save attempt");
            }

            return Ok(new { message = "Attempt saved successfully" });
        }

        
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

                
                if (!isTeacher && !string.IsNullOrEmpty(userName))
                {
                    results = results.Where(r => r.UserName == userName);
                    totalCount = results.Count();
                }

                
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

        
        [Authorize(Roles = "Teacher")]
        [HttpDelete("attempt/{attemptId}")]
        public async Task<IActionResult> DeleteAttempt(int attemptId)
        {
            bool deleted = await _repo.DeleteAttemptAsync(attemptId);

            if (!deleted)
            {
                _logger.LogError(
                    "[TakeQuizApiController] Attempt deletion failed for AttemptId {AttemptId:0000}",
                    attemptId
                );

                return BadRequest("Attempt deletion failed");
            }

            return NoContent();
        }

        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("attempt-details/{attemptId}")]
        public async Task<IActionResult> GetAttemptDetails(int attemptId)
        {
            var attempt = await _repo.GetResultByIdAsync(attemptId);
            if (attempt == null)
            {
                _logger.LogError("[TakeQuizAPIController] Attempt not found for AttemptId {AttemptId:0000}", attemptId);
                return NotFound("Attempt not found");
            } 

            var isTeacher = User.IsInRole("Teacher");
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type == "sub")?.Value;

            
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
