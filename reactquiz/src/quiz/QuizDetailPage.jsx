import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
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
        console.log("Loaded quiz:", data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quiz.");
      }
    };

    loadQuiz();
  }, [quizId]);

  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!quiz) return <div style={{ textAlign: "center" }}>
    <Spinner animation="border" size="sm" /> Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h2>Quiz Details</h2>
      <h3>{quiz.Title}</h3>

      {/* Show questions */}
      {quiz.Questions && quiz.Questions.length > 0 ? (
        <ul
          style={{
            listStyleType: "none",
            paddingLeft: "0",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {quiz.Questions.map((question, index) => (
            <li key={question.QuestionId} style={{ marginBottom: "25px" }}>
              <strong>
                Question {index + 1}: {question.Text}
              </strong>

              {/* Show image if it exists */}
              {question.ImageUrl && (
                <div className="text-center mt-2 mb-3">
                  <img
                    src={`http://localhost:5082${question.ImageUrl}`}
                    alt={`Question ${index + 1}`}
                    style={{ maxHeight: "250px", objectFit: "contain", borderRadius: "8px" }}
                  />
                </div>
              )}

              {/* Show answer options */}
              {question.AnswerOptions && question.AnswerOptions.length > 0 && (
                <ul
                  style={{
                    listStyleType: "circle",
                    paddingLeft: "20px",
                    marginTop: "5px",
                  }}
                >
                  {question.AnswerOptions.map((option) => (
                    <li key={option.AnswerOptionId}>
                      {option.Text}{" "}
                      {option.IsCorrect ? (
                        <span style={{ color: "green" }}>(Correct)</span>
                      ) : (
                        ""
                      )}
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