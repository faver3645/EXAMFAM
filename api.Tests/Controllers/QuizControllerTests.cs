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
    public class QuizAPIControllerTests
    {
        // Positive test: QuizList returns quizzes 
        [Fact]
        public async Task QuizList_ReturnsOkWithQuizzes()
        {
            var quizzes = new List<Quiz>
            {
                new Quiz { QuizId = 1, Title = "Quiz1" },
                new Quiz { QuizId = 2, Title = "Quiz2" }
            };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync(quizzes);

            var mockLogger = new Mock<ILogger<QuizAPIController>>();
            var controller = new QuizAPIController(mockRepo.Object, mockLogger.Object);

            var result = await controller.QuizList();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<QuizDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }

        // Negative test: QuizList returns NotFound when null 
        [Fact]
        public async Task QuizList_ReturnsNotFound_WhenNull()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync((IEnumerable<Quiz>?)null);

            var mockLogger = new Mock<ILogger<QuizAPIController>>();
            var controller = new QuizAPIController(mockRepo.Object, mockLogger.Object);

            var result = await controller.QuizList();

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // Positive test: GetQuiz returns Ok 
        [Fact]
        public async Task GetQuiz_ReturnsOk_WhenFound()
        {
            var quiz = new Quiz { QuizId = 1, Title = "Test Quiz" };
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync(quiz);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.GetQuiz(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<Quiz>(okResult.Value);
            Assert.Equal(1, returnValue.QuizId);
        }

        // Negative test: GetQuiz returns NotFound 
        [Fact]
        public async Task GetQuiz_ReturnsNotFound_WhenNotFound()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync((Quiz?)null);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.GetQuiz(1);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // Positive test: Create returns Created 
        [Fact]
        public async Task CreateQuiz_ReturnsCreated_WhenSuccess()
        {
            var quizDto = new QuizDto { Title = "New Quiz", Questions = new List<QuestionDto>() };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.Create(It.IsAny<Quiz>())).ReturnsAsync(true);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.Create(quizDto);

            Assert.IsType<CreatedAtActionResult>(result);
        }

        // Negative test: Create returns 500 when fail 
        [Fact]
        public async Task CreateQuiz_ReturnsServerError_WhenFail()
        {
            var quizDto = new QuizDto { Title = "Fail Quiz", Questions = new List<QuestionDto>() };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.Create(It.IsAny<Quiz>())).ReturnsAsync(false);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.Create(quizDto);

            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // Positive test: Update returns Ok 
        [Fact]
        public async Task UpdateQuiz_ReturnsOk_WhenSuccess()
        {
            var existingQuiz = new Quiz { QuizId = 1, Title = "Old Title", Questions = new List<Question>() };
            var quizDto = new QuizDto { Title = "Updated Title", Questions = new List<QuestionDto>() };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync(existingQuiz);
            mockRepo.Setup(r => r.Update(existingQuiz)).ReturnsAsync(true);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.Update(1, quizDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<Quiz>(okResult.Value);
            Assert.Equal("Updated Title", returnValue.Title);
        }

        // Negative test: Update returns NotFound 
        [Fact]
        public async Task UpdateQuiz_ReturnsNotFound_WhenQuizMissing()
        {
            var quizDto = new QuizDto { Title = "Updated Title", Questions = new List<QuestionDto>() };

            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.GetQuizById(1)).ReturnsAsync((Quiz?)null);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.Update(1, quizDto);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // Positive test: Delete returns NoContent 
        [Fact]
        public async Task DeleteQuiz_ReturnsNoContent_WhenSuccess()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.Delete(1)).ReturnsAsync(true);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.Delete(1);

            Assert.IsType<NoContentResult>(result);
        }

        // Negative test: Delete returns BadRequest 
        [Fact]
        public async Task DeleteQuiz_ReturnsBadRequest_WhenFail()
        {
            var mockRepo = new Mock<IQuizRepository>();
            mockRepo.Setup(r => r.Delete(1)).ReturnsAsync(false);

            var controller = new QuizAPIController(mockRepo.Object, Mock.Of<ILogger<QuizAPIController>>());

            var result = await controller.Delete(1);

            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}