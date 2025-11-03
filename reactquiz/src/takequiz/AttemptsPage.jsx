import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5082";

const AttemptsPage = () => {
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/takequizapi/attempts/${quizId}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setAttempts(data);
        if (data.length > 0) setQuizTitle(data[0].QuizTitle);
      } catch (err) {
        console.error(err);
        setError("Failed to load attempts.");
      }
    };

    fetchAttempts();
  }, [quizId]);

  if (error) return <p className="text-center text-danger mt-4">{error}</p>;
  if (!attempts) return <p className="text-center mt-4">Loading attempts...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <h2 className="mb-4 text-center">{quizTitle ? `Attempts for: ${quizTitle}` : "Attempts"}</h2>

      {attempts.length === 0 ? (
        <p className="text-center">No attempts have been made yet.</p>
      ) : (
        <div className="row g-4">
          {attempts.map((attempt) => {
            const percentage = Math.round((attempt.Score / attempt.TotalQuestions) * 100);
            
            // Fargekoding: grønn ≥80%, gul ≥50%, rød <50%
            let bgColor = "bg-danger text-white";
            if (percentage >= 80) bgColor = "bg-success text-white";
            else if (percentage >= 50) bgColor = "bg-warning text-dark";

            return (
              <div className="col-md-4" key={attempt.QuizResultId}>
                <div className={`card shadow-sm h-100 ${bgColor}`}>
                  <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                    <h5 className="card-title">{attempt.UserName}</h5>
                    <p className="card-text mb-1">Score: {attempt.Score} / {attempt.TotalQuestions}</p>
                    <p className="card-text mb-0">Prosent: {percentage}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/takequiz")}>
          Back to Quiz List
        </button>
      </div>
    </div>
  );
};

export default AttemptsPage;
