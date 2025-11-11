import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { fetchAttempts, deleteAttempt } from "./TakeQuizService";

const AttemptsPage = () => {
  const { quizId } = useParams();
  const { token, user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const navigate = useNavigate();

  const loadAttempts = useCallback(async () => {
    try {
      const data = await fetchAttempts(quizId, token);
      setAttempts(data);
      if (data.length > 0) setQuizTitle(data[0].QuizTitle);
    } catch (err) {
      console.error(err);
      setError("Failed to load attempts.");
    }
  }, [quizId, token]);

  useEffect(() => { loadAttempts(); }, [loadAttempts]);

  const confirmDeleteAttempt = (attempt) => { setSelectedAttempt(attempt); setShowModal(true); };
  const handleDeleteAttempt = async () => {
    if (!selectedAttempt) return;
    try {
      await deleteAttempt(selectedAttempt.QuizResultId, token);
      setStatusMessage("Attempt deleted successfully!");
      setAttempts(prev => prev.filter(a => a.QuizResultId !== selectedAttempt.QuizResultId));
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to delete attempt.");
    } finally {
      setSelectedAttempt(null);
      setShowModal(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <h2 className="mb-4 text-center">{quizTitle ? `Attempts for: ${quizTitle}` : "Attempts"}</h2>

      {statusMessage && <div className="alert alert-info text-center">{statusMessage}</div>}
      {error && <p className="text-center text-danger">{error}</p>}

      {attempts.length === 0 ? (
        <p className="text-center">No attempts yet.</p>
      ) : (
        <div className="row g-4">
          {attempts.map(a => {
            const percentage = Math.round((a.Score / a.TotalQuestions) * 100);
            let bgColor = percentage >= 80 ? "bg-success text-white" : percentage >= 50 ? "bg-warning text-dark" : "bg-danger text-white";
            return (
              <div className="col-md-4" key={a.QuizResultId}>
                <div className={`card shadow-sm h-100 ${bgColor}`}>
                  <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                    <h5 className="card-title">{a.UserName}</h5>
                    <p className="card-text mb-1">Score: {a.Score} / {a.TotalQuestions}</p>
                    <p className="card-text mb-2">Prosent: {percentage}%</p>
                    {user.role === "Teacher" && (
                      <button className="btn btn-outline-light btn-sm mt-auto" onClick={() => confirmDeleteAttempt(a)}>Delete Attempt</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate(user.role === "Student" ? "/takequiz" : "/quiz")}>Back</button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the attempt of <strong>{selectedAttempt?.UserName}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteAttempt}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptsPage;
