import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../auth/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const ViewAttemptPage = () => {
  const { token } = useAuth();
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/takequizapi/attempt-details/${attemptId}`, {
          headers: getHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to fetch attempt details");
        const data = await res.json();
        setAttempt(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load attempt details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttemptDetails();
  }, [attemptId, token]);

  if (loading) return <div className="text-center">
    <Spinner animation="border" size="sm" /> Loading attempt...</div>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!attempt) return <p className="text-center">No attempt found.</p>;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4 text-center">Attempt by {attempt.UserName}</h2>
      <p className="text-center mb-3">
        <strong>Score:</strong> {attempt.Score} / {attempt.Questions.length}  
        &nbsp;({Math.round((attempt.Score / attempt.Questions.length) * 100)}%)
      </p>
      <p className="text-center mb-4">
        <strong>Time Used:</strong> {formatTime(attempt.TimeSpent)}
      </p>

      {attempt.Questions.map((q, index) => (
        <div key={q.QuestionId} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">
              {index + 1}. {q.Text}
            </h5>
            {q.ImageUrl && (
              <div className="mb-2 text-center">
                <img
                  src={`http://localhost:5082${q.ImageUrl}`}
                  alt={`Question ${index + 1}`}
                  className="img-fluid"
                  style={{ maxHeight: "250px", objectFit: "contain" }}
                />
              </div>
            )}
            <ul className="list-group">
              {q.AnswerOptions.map((a) => (
                <li
                  key={a.AnswerOptionId}
                  className={`list-group-item ${
                    a.IsCorrect ? "list-group-item-success" : a.Selected ? "list-group-item-danger" : ""
                  }`}
                >
                  {a.Text} {a.Selected ? "(Selected)" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewAttemptPage;