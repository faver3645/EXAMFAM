using Microsoft.EntityFrameworkCore;
using ITPE3200FAM.Models;
using Microsoft.Extensions.Logging;

namespace ITPE3200FAM.DAL
{
    public class QuizRepository : IQuizRepository
    {
        private readonly QuizDbContext _db;
        private readonly ILogger<QuizRepository> _logger;

        public QuizRepository(QuizDbContext db, ILogger<QuizRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IEnumerable<Quiz>?> GetAll()
        {
            try
            {
                return await _db.Quizzes
                    .Include(q => q.Questions)
                    .ThenInclude(a => a.AnswerOptions)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] GetAll() failed: {Message}", e.Message);
                return null;
            }
        }

        public async Task<Quiz?> GetQuizById(int id)
        {
            try
            {
                return await _db.Quizzes
                    .Include(q => q.Questions)
                    .ThenInclude(a => a.AnswerOptions)
                    .FirstOrDefaultAsync(q => q.QuizId == id);
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] GetQuizById({Id}) failed: {Message}", id, e.Message);
                return null;
            }
        }

        public async Task<bool> Create(Quiz quiz)
        {
            try
            {
                _db.Quizzes.Add(quiz);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] Create failed for quiz {@Quiz}: {Message}", quiz, e.Message);
                return false;
            }
        }

        public async Task<bool> Update(Quiz quiz)
        {
            try
            {
                _db.Quizzes.Update(quiz);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] Update failed for quiz {@Quiz}: {Message}", quiz, e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var quiz = await _db.Quizzes.FindAsync(id);
                if (quiz == null)
                {
                    _logger.LogWarning("[QuizRepository] Delete failed, quiz not found: {Id}", id);
                    return false;
                }

                _db.Quizzes.Remove(quiz);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] Delete({Id}) failed: {Message}", id, e.Message);
                return false;
            }
        }

        public async Task AddResultAsync(QuizResult result)
        {
            try
            {
                _db.UserQuizResults.Add(result);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] AddResultAsync failed for result {@Result}: {Message}", result, e.Message);
                throw; // evt. kast videre for at controller kan hÃ¥ndtere
            }
        }

        public async Task<IEnumerable<QuizResult>> GetResultsForQuizAsync(int quizId)
        {
            try
            {
                return await _db.UserQuizResults
                    .Include(r => r.Quiz)
                        .ThenInclude(q => q.Questions)
                            .ThenInclude(qt => qt.AnswerOptions)
                    .Where(r => r.QuizId == quizId)
                    .OrderByDescending(r => r.QuizResultId)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] GetResultsForQuizAsync({QuizId}) failed: {Message}", quizId, e.Message);
                return new List<QuizResult>();
            }
        }
    }
}