namespace api.DTOs
{
    public class QuizSubmissionDto
    {
        public int QuizId { get; set; }
        public string UserName { get; set; } = "";
        public Dictionary<int,int> Answers { get; set; } = new();
    }
}