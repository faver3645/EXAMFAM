namespace api.DTOs
{
    public class QuizResultDto
    {
        public int QuizResultId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public int Score { get; set; }
        }
}
