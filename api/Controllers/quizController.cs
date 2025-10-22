using Microsoft.AspNetCore.Mvc;
using ITPE3200FAM.Models;
using ITPE3200FAM.DAL;
using Microsoft.Extensions.Logging;

namespace ITPE3200FAM.Controllers
{
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
}