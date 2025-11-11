import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { fetchQuizById, submitQuiz } from "./TakeQuizService";

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const {token } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [unanswered, setUnanswered] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId, token);
        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz.");
      }
    };
    getQuiz();
  }, [quizId, token]);

  const handleAnswerChange = (questionId, answerOptionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerOptionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz) return;

    const missing = quiz.Questions.filter(q => !(q.QuestionId in answers)).map(q => q.QuestionId);
    setUnanswered(missing);
    if (missing.length > 0) return;

    const payload = { QuizId: quiz.QuizId, Answers: answers };
    try {
      const result = await submitQuiz(payload, token);
      navigate(`/takequiz/result/${quiz.QuizId}`, { state: { quiz, score: result.score ?? 0 } });
    } catch (err) {
      console.error(err);
      setError("Failed to submit quiz.");
    }
  };

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!quiz) return <p style={{ textAlign: "center" }}>Loading quiz...</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4 text-center">{quiz.Title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.Questions.map((q, index) => (
          <div key={q.QuestionId} className={`card mb-4 shadow-sm ${unanswered.includes(q.QuestionId) ? "border-danger" : ""}`}>
            <div className="card-body">
              <h5 className="card-title">Question {index + 1}: {q.Text}</h5>
              {q.AnswerOptions.map(option => (
                <div className="form-check mb-2" key={option.AnswerOptionId}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`answers_${q.QuestionId}`}
                    id={`q${q.QuestionId}_a${option.AnswerOptionId}`}
                    value={option.AnswerOptionId}
                    checked={answers[q.QuestionId] === option.AnswerOptionId}
                    onChange={() => handleAnswerChange(q.QuestionId, option.AnswerOptionId)}
                  />
                  <label className="form-check-label" htmlFor={`q${q.QuestionId}_a${option.AnswerOptionId}`}>{option.Text}</label>
                </div>
              ))}
              {unanswered.includes(q.QuestionId) && <span className="text-danger d-block mt-2">Please select an answer for this question.</span>}
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-success btn-md">Submit Quiz</button>
        <button type="button" className="btn btn-secondary btn-md ms-2" onClick={() => navigate("/takequiz")}>Cancel</button>
      </form>
    </div>
  );
};

export default TakeQuizPage;
