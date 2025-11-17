using api.Models;

namespace api.DAL;

public interface IQuizRepository
{
    Task<IEnumerable<Quiz>?> GetAll();
    Task<Quiz?> GetQuizById(int id);
    Task<bool> Create(Quiz quiz);
    Task<bool> Update(Quiz quiz);
    Task<bool> Delete(int id);

    Task AddResultAsync(QuizResult result);

    // filter + sort + paging
    Task<(IEnumerable<QuizResult> Results, int TotalCount)> 
        GetResultsForQuizAsync(int quizId, AttemptsQueryParams query);

    Task DeleteAttemptAsync(int attemptId);
<<<<<<< HEAD
    Task<QuizResult?> GetResultByIdAsync(int attemptId);
}
=======
}
>>>>>>> dd24401fd1f940a736dfdcb7900ca606616afc09
