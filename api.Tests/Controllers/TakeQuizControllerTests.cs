using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using api.Controllers;
using api.DAL;
using api.DTOs;
using api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace api.Tests.Controllers
{
    public class TakeQuizApiControllerTests
    {
        // ===== Positive test: GetAllQuizzes returns Ok =====
        [Fact]
        public async Task GetAllQuizzes_ReturnsOk_WhenQuizzesExist()
        {
            var quizzes = new List<Quiz>
            {
                new Quiz { QuizId = 1, Title = "Quiz1" },
                new Quiz { QuizId = 2, Title = "Quiz2" }
            };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync(quizzes);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.GetAllQuizzes();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<QuizDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }

        // ===== Negative test: GetAllQuizzes returns NotFound =====
        [Fact]
        public async Task GetAllQuizzes_ReturnsNotFound_WhenNoQuizzes()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync((IEnumerable<Quiz>?)null);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.GetAllQuizzes();

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // ===== Positive test: GetQuiz returns Ok =====
        [Fact]
        public async Task GetQuiz_ReturnsOk_WhenFound()
        {
            var quiz = new Quiz
            {
                QuizId = 1,
                Title = "Quiz1",
                Questions = new List<Question>
                {
                    new Question
                    {
                        QuestionId = 10,
                        Text = "Q1",
                        AnswerOptions = new List<AnswerOption>
                        {
                            new AnswerOption { AnswerOptionId = 100, Text = "A1", IsCorrect = true }
                        }
                    }
                }
            };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.GetQuiz(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<QuizDto>(okResult.Value);
            Assert.Equal("Quiz1", returnValue.Title);
            Assert.Single(returnValue.Questions);
        }

        // ===== Negative test: GetQuiz returns NotFound =====
        [Fact]
        public async Task GetQuiz_ReturnsNotFound_WhenNotFound()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync((Quiz?)null);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.GetQuiz(1);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // ===== Positive test: Submit returns correct score =====
        [Fact]
        public async Task SubmitQuiz_ReturnsOkWithScore()
        {
            var quiz = new Quiz
            {
                QuizId = 1,
                Questions = new List<Question>
                {
                    new Question
                    {
                        QuestionId = 1,
                        AnswerOptions = new List<AnswerOption>
                        {
                            new AnswerOption { AnswerOptionId = 10, IsCorrect = true },
                            new AnswerOption { AnswerOptionId = 11, IsCorrect = false }
                        }
                    }
                }
            };

            var submission = new QuizSubmissionDto
            {
                QuizId = 1,
                Answers = new Dictionary<int, int> { { 1, 10 } }
            };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.Submit(submission);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var score = Assert.IsType<Dictionary<string, int>>(okResult.Value);
            Assert.Equal(1, score["score"]);
        }

        // ===== Negative test: Submit returns NotFound when quiz missing =====
        [Fact]
        public async Task SubmitQuiz_ReturnsNotFound_WhenQuizMissing()
        {
            var submission = new QuizSubmissionDto
            {
                QuizId = 1,
                Answers = new Dictionary<int, int>()
            };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync((Quiz?)null);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.Submit(submission);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // ===== Positive test: SaveAttempt returns Ok =====
        [Fact]
        public async Task SaveAttempt_ReturnsOk_WhenSuccess()
        {
            var dto = new QuizResultDto
            {
                QuizId = 1,
                UserName = "Test",
                Score = 5
            };

            var quiz = new Quiz { QuizId = 1 };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);
            mockRepo.Setup(r => r.AddResultAsync(It.IsAny<QuizResult>())).Returns(Task.CompletedTask);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.SaveAttempt(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
        }

        // ===== Negative test: SaveAttempt returns 500 on exception =====
        [Fact]
        public async Task SaveAttempt_ReturnsServerError_WhenException()
        {
            var dto = new QuizResultDto { QuizId = 1, UserName = "Test", Score = 5 };
            var quiz = new Quiz { QuizId = 1 };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);
            mockRepo.Setup(r => r.AddResultAsync(It.IsAny<QuizResult>())).ThrowsAsync(new System.Exception("DB fail"));

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.SaveAttempt(dto);

            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // ===== Positive test: DeleteAttempt returns Ok =====
        [Fact]
        public async Task DeleteAttempt_ReturnsOk_WhenSuccess()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.DeleteAttemptAsync(1)).Returns(Task.CompletedTask);

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.DeleteAttempt(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
        }

        // ===== Negative test: DeleteAttempt returns 500 on exception =====
        [Fact]
        public async Task DeleteAttempt_ReturnsServerError_WhenException()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.DeleteAttemptAsync(1)).ThrowsAsync(new System.Exception("DB fail"));

            var controller = new TakeQuizApiController(mockRepo.Object, Mock.Of<ILogger<TakeQuizApiController>>());

            var result = await controller.DeleteAttempt(1);

            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }
    }
}