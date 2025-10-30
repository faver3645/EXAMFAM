using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DAL;
using api.DTOs;
using Microsoft.Extensions.Logging;
namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizAPIController : ControllerBase  // ControllerBase is sufficient for API controllers, avoiding View-related features
{
    private readonly IQuizRepository _repo;
    private readonly ILogger<QuizAPIController> _logger;

    public QuizAPIController(IQuizRepository repo, ILogger<QuizAPIController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet("quizlist")]
    public async Task<IActionResult> QuizList()
    {
        var quizzes = await _repo.GetAll();
        if (quizzes == null)
        {
            _logger.LogError("[QuizAPIController] quiz list not found while executing _repo.GetAll()");
            return NotFound("quiz list not found");
        }

        var quizDtos = quizzes.Select(quizzes => new QuizDto
        {
            QuizId = quizzes.QuizId,
            Title = quizzes.Title
        });

        return Ok(quizDtos);
    }


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
                AnswerOptions = q.AnswerOptions.Select(a => new AnswerOption
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList()
        };

        bool result = await _repo.Create(newQuiz);

        if (result)
        {
            return CreatedAtAction(nameof(QuizList), new { id = newQuiz.QuizId }, newQuiz);
        }

        _logger.LogWarning("[QuizAPIController] Quiz creation failed {@Quiz}", newQuiz);
        return StatusCode(500, "Internal server error");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuiz(int id)
    {
        var quiz = await _repo.GetQuizById(id); // Sørg for at du har denne metoden i IQuizRepository
        if (quiz == null)
        {
            _logger.LogWarning("[QuizAPIController] Quiz with id {Id} not found", id);
            return NotFound();
        }

        var quizDto = new QuizDto
        {
            QuizId = quiz.QuizId,
            Title = quiz.Title,
            Questions = quiz.Questions?.Select(q => new QuestionDto
            {
                QuestionId = q.QuestionId,
                Text = q.Text,
                AnswerOptions = q.AnswerOptions?.Select(a => new AnswerOptionDto
                {
                    AnswerOptionId = a.AnswerOptionId,
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList()
        };

        return Ok(quizDto);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizDto quizDto)
    {
        if (quizDto == null)
            return BadRequest("Quiz data cannot be null");

        // Hent eksisterende quiz
        var existingQuiz = await _repo.GetQuizById(id);
        if (existingQuiz == null)
        {
            _logger.LogWarning("[QuizAPIController] Quiz with id {Id} not found", id);
            return NotFound($"Quiz with id {id} not found");
        }

        // Oppdater feltene
        existingQuiz.Title = quizDto.Title;

        // Hvis du vil gjøre full update av spørsmål og svar:
        existingQuiz.Questions = quizDto.Questions?.Select(q => new Question
        {
            Text = q.Text,
            AnswerOptions = q.AnswerOptions?.Select(a => new AnswerOption
            {
                Text = a.Text,
                IsCorrect = a.IsCorrect
            }).ToList() ?? new List<AnswerOption>()
        }).ToList() ?? new List<Question>();

        // Lagre endringer
        bool result = await _repo.Update(existingQuiz); // Sørg for at repo har Update-metode

        if (result)
        {
            return Ok(existingQuiz);
        }

        _logger.LogError("[QuizAPIController] Failed to update quiz {@Quiz}", existingQuiz);
        return StatusCode(500, "Internal server error while updating quiz");
    }
    

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


    public class QuizController : Controller
    {
        private readonly IQuizRepository _repo;
        private readonly ILogger<QuizController> _logger;

        public QuizController(IQuizRepository repo, ILogger<QuizController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        // GET: /Quiz
        public async Task<IActionResult> Index()
        {
            var quizzes = await _repo.GetAll();
            if (quizzes == null)
            {
                _logger.LogError("[QuizController] No quizzes found when executing _repo.GetAll()");
                return NotFound("Quiz list not found");
            }
            return View(quizzes);
        }

        // GET: /Quiz/Details
        public async Task<IActionResult> Details(int id)
        {
            var quiz = await _repo.GetQuizById(id);
            if (quiz == null)
            {
                _logger.LogError("[QuizController] Quiz not found for QuizId {QuizId:0000}", id);
                return NotFound("Quiz not found");
            }

            return View(quiz);
        }

        // GET: /Quiz/Create
        [HttpGet]
        public IActionResult Create()
        {
            var quiz = new Quiz
            {
                Questions = new List<Question>
                {
                    new Question
                    {
                        AnswerOptions = new List<AnswerOption>
                        {
                            new AnswerOption(),
                            new AnswerOption()
                        }
                    }
                }
            };
            return View(quiz);
        }

        // POST: /Quiz/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Quiz quiz)
        {
            for (int i = 0; i < quiz.Questions.Count; i++)
            {
                var question = quiz.Questions[i];
                if (!question.AnswerOptions.Any(a => a.IsCorrect))
                {
                    ModelState.AddModelError("", $"Question {i + 1} must have at least one correct answer.");
                }
            }

            if (!ModelState.IsValid)
                return View(quiz);

            bool created = await _repo.Create(quiz);
            if (!created)
            {
                _logger.LogWarning("[QuizController] Quiz creation failed {@Quiz}", quiz);
                return View(quiz);
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: /Quiz/Update
        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            var quiz = await _repo.GetQuizById(id);
            if (quiz == null)
            {
                _logger.LogError("[QuizController] Quiz not found when updating QuizId {QuizId:0000}", id);
                return BadRequest("Quiz not found");
            }
            return View(quiz);
        }

        // POST: /Quiz/Update
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(Quiz quiz)
        {
            for (int i = 0; i < quiz.Questions.Count; i++)
            {
                var question = quiz.Questions[i];
                if (!question.AnswerOptions.Any(a => a.IsCorrect))
                {
                    ModelState.AddModelError("", $"Question {i + 1} must have at least one correct answer.");
                }
            }

            if (!ModelState.IsValid)
                return View(quiz);

            bool updated = await _repo.Update(quiz);
            if (!updated)
            {
                _logger.LogWarning("[QuizController] Quiz update failed {@Quiz}", quiz);
                return View(quiz);
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: /Quiz/Delete
        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var quiz = await _repo.GetQuizById(id);
            if (quiz == null)
            {
                _logger.LogError("[QuizController] Quiz not found for QuizId {QuizId:0000}", id);
                return BadRequest("Quiz not found");
            }
            return View(quiz);
        }

        // POST: /Quiz/DeleteConfirmed
        [HttpPost, ActionName("DeleteConfirmed")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            bool deleted = await _repo.Delete(id);
            if (!deleted)
            {
                _logger.LogError("[QuizController] Quiz deletion failed for QuizId {QuizId:0000}", id);
                return BadRequest("Quiz deletion failed");
            }

            return RedirectToAction(nameof(Index));
        }
    }