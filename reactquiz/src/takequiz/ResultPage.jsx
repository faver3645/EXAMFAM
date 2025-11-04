import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAttempt } from "./TakeQuizService"; // <-- bruk tjenesten

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz, userName, score } = location.state || {};
  const [status, setStatus] = useState({ message: "", type: "" });

  if (!quiz) {
    return <p className="text-center text-danger">No result data available.</p>;
  }

  const totalQuestions = quiz.Questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  let progressColor = "bg-danger";
  if (percentage >= 80) progressColor = "bg-success";
  else if (percentage >= 50) progressColor = "bg-warning";

  const handleSaveAttempt = async () => {
    try {
      await saveAttempt({
        QuizId: quiz.QuizId,
        UserName: userName,
        Score: score,
      });

      setStatus({ message: "✅ Attempt saved successfully!", type: "success" });

      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error saving attempt:", error);
      setStatus({ message: "❌ Failed to save attempt.", type: "danger" });
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Quiz Result: {quiz.Title}</h2>

      <div className="card shadow-sm p-4 mb-4 mx-auto" style={{ maxWidth: "600px" }}>
        {status.message && (
          <div className={`alert alert-${status.type} text-center`} role="alert">
            {status.message}
          </div>
        )}

        <p><strong>User:</strong> {userName}</p>
        <p><strong>Score:</strong> {score} / {totalQuestions} ({percentage}%)</p>

        <div className="progress mb-3" style={{ height: "25px" }}>
          <div
            className={`progress-bar ${progressColor}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
          >
            {percentage}%
          </div>
        </div>

        <p className="fw-bold text-center">
          {percentage >= 80 ? (
            <span className="text-success">Excellent! 🎉</span>
          ) : percentage >= 50 ? (
            <span className="text-warning">Good job! Keep practicing.</span>
          ) : (
            <span className="text-danger">You can do better! Try again.</span>
          )}
        </p>

        <div className="text-center mt-4">
          <button onClick={handleSaveAttempt} className="btn btn-success me-2">
            Save Attempt
          </button>
          <button
            onClick={() => navigate(`/takequiz/take/${quiz.QuizId}`)}
            className="btn btn-warning me-2"
          >
            Try Again 🔁
          </button>
          <button
            onClick={() => navigate("/takequiz")}
            className="btn btn-primary"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
