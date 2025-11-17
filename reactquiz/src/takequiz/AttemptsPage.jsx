import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { fetchAttempts, deleteAttempt } from "./TakeQuizService";

const PAGE_SIZE = 6; // 6 attempts per page

const AttemptsPage = () => {
  const { quizId } = useParams();
  const { token, user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [sortOption, setSortOption] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadAttempts = useCallback(async (page = 1) => {
    try {
      const data = await fetchAttempts(quizId, token, page, PAGE_SIZE, sortOption);
      const attemptsArray = Array.isArray(data?.data) ? data.data : [];
      setAttempts(attemptsArray);
      setCurrentPage(page);
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE));
      if (attemptsArray.length > 0) setQuizTitle(attemptsArray[0].QuizTitle);
    } catch (err) {
      console.error(err);
      setError("Failed to load attempts.");
    }
  }, [quizId, token, sortOption]);

  useEffect(() => {
    loadAttempts(1);
  }, [loadAttempts]);

  // Filtrering basert på søk
  useEffect(() => {
    let filtered = attempts;
    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = attempts.filter(a => a.UserName.toLowerCase().includes(lowerTerm));
    }
    // For studenter, vis kun deres egne forsøk
    if (user.role === "Student") {
      filtered = filtered.filter(a => a.UserName === user.name);
    }
    setFilteredAttempts(filtered);
  }, [attempts, searchTerm, user]);

  const confirmDeleteAttempt = (attempt) => {
    setSelectedAttempt(attempt);
    setShowModal(true);
  };

  const handleDeleteAttempt = async () => {
    if (!selectedAttempt) return;
    try {
      await deleteAttempt(selectedAttempt.QuizResultId, token);
      setStatusMessage("Attempt deleted successfully!");
      loadAttempts(currentPage); // reload current page after deletion
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to delete attempt.");
    } finally {
      setSelectedAttempt(null);
      setShowModal(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadAttempts(page);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <h2 className="mb-4 text-center">
        {quizTitle ? `Attempts for: ${quizTitle}` : "Attempts"}
      </h2>

      {statusMessage && <div className="alert alert-info text-center">{statusMessage}</div>}
      {error && <p className="text-center text-danger">{error}</p>}

      {attempts.length > 0 && (
        <div className="mb-3 d-flex justify-content-between flex-wrap">
          <div className="d-flex align-items-center mb-2">
            <label className="me-2" htmlFor="sortSelect">Sort by:</label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="form-select w-auto"
            >
              <option value="date_desc">Date: Newest → Oldest</option>
              <option value="date_asc">Date: Oldest → Newest</option>
              <option value="score_desc">Score: High → Low</option>
              <option value="score_asc">Score: Low → High</option>
            </select>
          </div>

          {user.role === "Teacher" && (
            <div className="d-flex align-items-center mb-2">
              <input
                type="text"
                className="form-control w-auto"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {filteredAttempts.length === 0 ? (
        <p className="text-center">No attempts found.</p>
      ) : (
        <>
          <div className="row g-4">
            {filteredAttempts.map((a) => {
              const percentage = Math.round((a.Score / a.TotalQuestions) * 100);
              const bgColor =
                percentage >= 80 ? "bg-success text-white" :
                percentage >= 50 ? "bg-warning text-dark" : "bg-danger text-white";
              const submittedDate = a.SubmittedAt
                ? new Date(a.SubmittedAt).toLocaleString("no-NO", {
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit", second: "2-digit"
                  })
                : "Unknown";
              const totalSeconds = a.TimeUsedSeconds ?? 0;
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = totalSeconds % 60;

              return (
                <div className="col-md-4" key={a.QuizResultId}>
                  <div className={`card shadow-sm h-100 ${bgColor}`}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                      <h5 className="card-title">{a.UserName}</h5>
                      <p className="card-text mb-1">Score: {a.Score} / {a.TotalQuestions}</p>
                      <p className="card-text mb-2">Prosent: {percentage}%</p>
                      <p className="card-text mb-1">Time Used: {minutes} min {seconds} sec</p>
                      <p className="card-text mb-2">Submitted: {submittedDate}</p>
                      
                      <button
                        className="btn btn-outline-light btn-sm mt-2"
                        onClick={() => navigate(`/takequiz/attempt/${a.QuizResultId}`)}
                      >
                        View Attempt
                      </button>
                      
                      {user.role === "Teacher" && (
                        <button
                          className="btn btn-outline-light btn-sm mt-auto"
                          onClick={() => confirmDeleteAttempt(a)}
                        >
                          Delete Attempt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i+1} className={`page-item ${currentPage === i+1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i+1)}>{i+1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </>
      )}

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(user.role === "Student" ? "/takequiz" : "/teacher-dashboard")
          }
        >
          Back
        </button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
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
