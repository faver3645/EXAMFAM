using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.DAL;

public class QuizDbContext : DbContext
{
    public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options)
    {
        //Database.EnsureCreated();
    }

    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<AnswerOption> AnswerOptions { get; set; }
    public DbSet<QuizResult> UserQuizResults { get; set; }
}