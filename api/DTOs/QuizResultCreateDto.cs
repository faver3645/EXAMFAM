namespace api.DTOs
{
    public class QuizResultCreateDto
    {
        public int QuizId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Score { get; set; }
    }
}
