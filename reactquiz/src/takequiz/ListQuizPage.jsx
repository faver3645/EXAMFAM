import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { fetchAvailableQuizzes } from "./TakeQuizService";

const ListQuizPage = () => {
  const { token, user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Quizzes</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {loading ? (
        <p className="text-center">Loading quizzes...</p>
      ) : quizzes.length > 0 ? (
        <div className="row">
          {quizzes.map((quiz) => (
            <div className="col-md-4 mb-3" key={quiz.QuizId}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{quiz.Title}</h5>
                  <div className="mt-auto d-flex justify-content-center">
                    {/* Student kan starte quiz */}
                    {user?.role === "Student" && (
                      <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          navigate(`/takequiz/take/${quiz.QuizId}`)
                        }
                      >
                        Start Quiz
                      </button>
                    )}
                    {/* Alle kan se attempts */}
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
        <p className="text-center">No quizzes available.</p>
      )}
    </div>
  );
};

export default ListQuizPage;
