
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Query;
using Microsoft.Extensions.Logging;
namespace api.DAL
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
        public async Task<bool> AddResultAsync(QuizResult result)
        {
            try
            {
                _db.UserQuizResults.Add(result);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] AddResultAsync failed: {Message}", e.Message);
                return false;
            }
        }
        // Filtering + Sorting + Paging + Search
        public async Task<(IEnumerable<QuizResult> Results, int TotalCount)>
            GetResultsForQuizAsync(int quizId, AttemptsQueryParams query)
        {
            try
            {
                var q = _db.UserQuizResults
                    .Include(r => r.Quiz)
                        .ThenInclude(q => q.Questions)
                            .ThenInclude(qt => qt.AnswerOptions)
                    .Where(r => r.QuizId == quizId)
                    .AsQueryable();
                // search
                if (!string.IsNullOrWhiteSpace(query.Search))
                {
                    var term = query.Search.Trim().ToLower();
                    q = q.Where(r => r.UserName != null && r.UserName.ToLower().Contains(term));
                }
                // filtering
                if (query.FromDate.HasValue)
                    q = q.Where(r => r.SubmittedAt >= query.FromDate.Value);
                if (query.ToDate.HasValue)
                    q = q.Where(r => r.SubmittedAt <= query.ToDate.Value);
                if (query.MinScore.HasValue)
                    q = q.Where(r => r.Score >= query.MinScore.Value);
                if (query.MaxScore.HasValue)
                    q = q.Where(r => r.Score <= query.MaxScore.Value);
                var totalCount = await q.CountAsync();
                // sorting
                bool asc = query.SortOrder.ToLower() == "asc";
                q = query.SortBy.ToLower() switch
                {
                    "score" => asc ? q.OrderBy(r => r.Score).ThenBy(r => r.SubmittedAt)
                                   : q.OrderByDescending(r => r.Score).ThenByDescending(r => r.SubmittedAt),
                    "submittedat" or _ => asc ? q.OrderBy(r => r.SubmittedAt)
                                             : q.OrderByDescending(r => r.SubmittedAt),
                };
                // paging
                int page = query.Page <= 0 ? 1 : query.Page;
                int pageSize = query.PageSize <= 0 ? 50 : query.PageSize;
                q = q.Skip((page - 1) * pageSize).Take(pageSize);
                var results = await q.ToListAsync();
                return (results, totalCount);
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] GetResultsForQuizAsync({QuizId}) failed: {Message}", quizId, e.Message);
                return (new List<QuizResult>(), 0);
            }
        }
        public async Task<bool> DeleteAttemptAsync(int attemptId)
        {
            try
            {
                var attempt = await _db.UserQuizResults.FindAsync(attemptId);
                if (attempt == null)
                {
                    _logger.LogWarning("[QuizRepository] DeleteAttemptAsync failed, attempt not found: {AttemptId}", attemptId);
                    return false;
                }
                _db.UserQuizResults.Remove(attempt);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[QuizRepository] DeleteAttemptAsync({AttemptId}) failed: {Message}", attemptId, e.Message);
                return false;
            }
        }

        public async Task<QuizResult?> GetResultByIdAsync(int attemptId)
        {
            try
            {
                var result = await _db.UserQuizResults
                    .Include(q => q.Quiz)
                        .ThenInclude(quiz => quiz.Questions)
                            .ThenInclude(q => q.AnswerOptions)
                    .Include(q => q.Answers)
                    .FirstOrDefaultAsync(q => q.QuizResultId == attemptId);

                if (result == null)
                {
                    _logger.LogWarning("[QuizRepository] GetResultByIdAsync: QuizResult with Id {AttemptId} not found", attemptId);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[QuizRepository] GetResultByIdAsync failed for AttemptId {AttemptId}", attemptId);
                return null; 
        }
    }
    }
}
