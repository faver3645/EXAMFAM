import React from "react";
import { Link } from "react-router-dom";

function ResultPage({ result }) {
  if (!result || !result.quiz) return <p>Loading...</p>;

  const totalQuestions = result.quiz.questions.length;
  const percentage = Math.round((result.score / totalQuestions) * 100);

  const progressColor =
    percentage >= 80
      ? "bg-success"
      : percentage >= 50
      ? "bg-warning"
      : "bg-danger";

  return (
    <div>
      <h2 className="mb-4 text-center">Quiz Result: {result.quiz.title}</h2>

      <div
        className="card shadow-sm p-4 mb-4 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <p>
          <strong>User:</strong> {result.userName}
        </p>
        <p>
          <strong>Score:</strong> {result.score} / {totalQuestions} (
          {percentage}%)
        </p>

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

        {/* Buttons */}
        <div className="text-center mt-4">
          {/* Save Attempt – du kan koble denne til en API-kall-funksjon */}
          <button
            className="btn btn-success me-2"
            onClick={() =>
              console.log("Saving attempt...", {
                quizId: result.quizId,
                userName: result.userName,
                score: result.score,
              })
            }
          >
            Save Attempt
          </button>

          <Link
            to={`/takequiz/take/${result.quizId}`}
            className="btn btn-warning me-2"
          >
            Try Again 🔁
          </Link>

          <Link to="/takequiz" className="btn btn-primary">
            Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
