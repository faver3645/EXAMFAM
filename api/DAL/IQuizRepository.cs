using ITPE3200FAM.Models;

namespace ITPE3200FAM.DAL;

public interface IQuizRepository
{
    Task<IEnumerable<Quiz>?> GetAll();
    Task<Quiz?> GetQuizById(int id);
    Task <bool> Create(Quiz quiz);
    Task <bool> Update(Quiz quiz);
    Task <bool> Delete(int id);
    Task AddResultAsync(QuizResult result);
    Task<IEnumerable<QuizResult>> GetResultsForQuizAsync(int quizId);
}