import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function TakeQuizPage({ quiz }) {
  const navigate = useNavigate();

  // Local state
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState({});
  const [unanswered, setUnanswered] = useState([]);

  if (!quiz) return <p>Loading quiz...</p>;

  // Handle selection of an answer
  const handleAnswerChange = (questionId, answerOptionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerOptionId,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for unanswered questions
    const unansweredQs = quiz.questions
      .filter((q) => !answers[q.questionId])
      .map((q) => q.questionId);

    if (unansweredQs.length > 0) {
      setUnanswered(unansweredQs);
      return;
    }

    // Build payload
    const payload = {
      quizId: quiz.quizId,
      userName,
      answers,
    };

    try {
      // Example API call (replace URL with your backend endpoint)
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");

      const result = await response.json();
      navigate(`/takequiz/result/${quiz.quizId}`, { state: { result } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting your quiz.");
    }
  };

  return (
    <div>
      <h2 className="mb-4">{quiz.title}</h2>

      <form onSubmit={handleSubmit}>
        {/* Hidden quizId */}
        <input type="hidden" name="quizId" value={quiz.quizId} />

        {/* USER NAME */}
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            Your Name:
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="form-control"
            value={userName}
            placeholder="Enter your name"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          {userName.trim() === "" && (
            <span className="text-danger">Please enter your name.</span>
          )}
        </div>

        {/* QUESTIONS */}
        {quiz.questions.map((q, i) => (
          <div
            key={q.questionId}
            className={`card mb-4 shadow-sm ${
              unanswered.includes(q.questionId) ? "border-danger" : ""
            }`}
          >
            <div className="card-body">
              <h5 className="card-title">
                Question {i + 1}: {q.text}
              </h5>

              {q.answerOptions.map((option) => (
                <div className="form-check mb-2" key={option.answerOptionId}>
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`answers[${q.questionId}]`}
                    id={`q${q.questionId}-option${option.answerOptionId}`}
                    value={option.answerOptionId}
                    checked={answers[q.questionId] === option.answerOptionId}
                    onChange={() =>
                      handleAnswerChange(q.questionId, option.answerOptionId)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`q${q.questionId}-option${option.answerOptionId}`}
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

        <button type="submit" className="btn btn-success btn-lg">
          Submit Quiz
        </button>

        <Link to="/takequiz" className="btn btn-secondary btn-lg ms-2">
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default TakeQuizPage;
