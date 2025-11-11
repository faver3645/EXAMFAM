import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { saveAttempt } from "./TakeQuizService";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const { quiz, score } = location.state || {};
  const [status, setStatus] = useState({ message: "", type: "" });

  if (!quiz) return <p className="text-center text-danger">No result data available.</p>;

  const totalQuestions = quiz.Questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  let progressColor = percentage >= 80 ? "bg-success" : percentage >= 50 ? "bg-warning" : "bg-danger";

  const handleSaveAttempt = async () => {
    try {
      await saveAttempt({ QuizId: quiz.QuizId, Score: score }, token);
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
        {status.message && <div className={`alert alert-${status.type} text-center`}>{status.message}</div>}
        <p><strong>User:</strong> {user.sub}</p>
        <p><strong>Score:</strong> {score} / {totalQuestions} ({percentage}%)</p>

        <div className="progress mb-3" style={{ height: "25px" }}>
          <div className={`progress-bar ${progressColor}`} role="progressbar" style={{ width: `${percentage}%` }}>
            {percentage}%
          </div>
        </div>

        <p className="fw-bold text-center">
          {percentage >= 80 ? "Excellent! 🎉" : percentage >= 50 ? "Good job! Keep practicing." : "You can do better! Try again."}
        </p>

        <div className="text-center mt-4">
          <button onClick={handleSaveAttempt} className="btn btn-success me-2">Save Attempt</button>
          <button onClick={() => navigate(`/takequiz/take/${quiz.QuizId}`)} className="btn btn-warning me-2">Try Again 🔁</button>
          <button onClick={() => navigate("/takequiz")} className="btn btn-primary">Back to Quizzes</button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
