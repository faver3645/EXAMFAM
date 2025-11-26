using api.Models;
using api.Query;

namespace api.DAL;

public interface IQuizRepository
{
    Task<IEnumerable<Quiz>?> GetAll();
    Task<Quiz?> GetQuizById(int id);
    Task<bool> Create(Quiz quiz);
    Task<bool> Update(Quiz quiz);
    Task<bool> Delete(int id);

    Task<bool> AddResultAsync(QuizResult result);

    // filter + sort + paging
    Task<(IEnumerable<QuizResult> Results, int TotalCount)> 
        GetResultsForQuizAsync(int quizId, AttemptsQueryParams query);

    Task<bool> DeleteAttemptAsync(int attemptId);
    Task<QuizResult?> GetResultByIdAsync(int attemptId);
}
