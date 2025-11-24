import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Form, InputGroup } from "react-bootstrap";
import { useAuth } from "../auth/useAuth";
import { fetchAvailableQuizzes } from "../takequiz/TakeQuizService";

const TeacherDashboard = () => {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAvailableQuizzes(token);
        setQuizzes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [token]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">View Attempts</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      
      <div className="d-flex justify-content-center mb-4">
        <InputGroup style={{ maxWidth: "400px" }}>
          <Form.Control
            type="text"
            placeholder="Search quiz title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" size="sm" /> Loading attempts...</div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="row">
          {filteredQuizzes.map((quiz) => (
            <div className="col-md-4 mb-3" key={quiz.QuizId}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{quiz.Title}</h5>
                  <div className="mt-auto d-flex justify-content-center">
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        navigate(`/takequiz/${quiz.QuizId}/attempts`)
                      }
                    >
                      View Attempts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No attempts found.</div>
      )}
    </div>
  );
};

export default TeacherDashboard;
