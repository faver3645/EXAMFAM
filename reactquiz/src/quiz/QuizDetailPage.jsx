import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizById } from "./QuizService"; 

const QuizDetailPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId); 
        setQuiz(data);
        console.log(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quiz.");
      }
    };

    loadQuiz();
  }, [quizId]);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!quiz) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h2>Quiz Details</h2>
      <h3>{quiz.Title}</h3>

      {quiz.Questions && quiz.Questions.length > 0 ? (
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "0",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {quiz.Questions.map((question) => (
            <li key={question.Id} style={{ marginBottom: "15px" }}>
              <strong>{question.Text}</strong>
              {question.AnswerOptions && question.AnswerOptions.length > 0 && (
                <ul
                  style={{
                    listStyleType: "circle",
                    paddingLeft: "20px",
                    marginTop: "5px",
                  }}
                >
                  {question.AnswerOptions.map((option) => (
                    <li key={option.Id}>
                      {option.Text} {option.IsCorrect ? "(Correct)" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}

      <div style={{ marginTop: "30px" }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default QuizDetailPage;
