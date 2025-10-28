import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5082";

const QuizDetailPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/api/quizapi/${quizId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quiz.");
      }
    };

    fetchQuiz();
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

      {/* Wrapper for knappen slik at den havner under listen */}
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