import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5082";

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [userName, setUserName] = useState("");
  const [unanswered, setUnanswered] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 Hent quiz-data fra API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/api/takequizapi/${quizId}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  // 🔹 Oppdater svar
  const handleAnswerChange = (questionId, answerOptionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerOptionId,
    }));
  };

  // 🔹 Send inn quiz
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Finn spørsmål som ikke er besvart
    const missing = quiz.questions
      .filter((q) => !answers[q.questionId])
      .map((q) => q.questionId);

    if (missing.length > 0) {
      setUnanswered(missing);
      return;
    }

    const payload = {
      quizId: quiz.quizId,
      userName,
      answers,
    };

    try {
      const response = await fetch(`${API_URL}/api/takequizapi/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit quiz.");

      navigate(`/takequiz/result/${quizId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to submit quiz.");
    }
  };

  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  if (!quiz)
    return <p style={{ textAlign: "center" }}>Loading quiz...</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4 text-center">{quiz.title}</h2>

      <form onSubmit={handleSubmit}>
        {/* USER NAME */}
        <div className="mb-4">
          <label className="form-label">Your Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        {/* QUESTIONS */}
        {quiz.questions.map((q, index) => (
          <div
            key={q.questionId}
            className={`card mb-4 shadow-sm ${
              unanswered.includes(q.questionId) ? "border-danger" : ""
            }`}
          >
            <div className="card-body">
              <h5 className="card-title">
                Question {index + 1}: {q.text}
              </h5>

              {q.answerOptions.map((option) => (
                <div className="form-check mb-2" key={option.answerOptionId}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`answers_${q.questionId}`}
                    id={`q${q.questionId}_a${option.answerOptionId}`}
                    value={option.answerOptionId}
                    checked={answers[q.questionId] === option.answerOptionId}
                    onChange={() =>
                      handleAnswerChange(q.questionId, option.answerOptionId)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`q${q.questionId}_a${option.answerOptionId}`}
                  >
                    {option.text}
                  </label>
                </div>
              ))}

              {unanswered.includes(q.questionId) && (
                <span className="text-danger d-block mt-2">
                  Please select an answer for this question.
                </span>
              )}
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-success btn-md">
          Submit Quiz
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-md ms-2"
          onClick={() => navigate("/takequiz")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TakeQuizPage;