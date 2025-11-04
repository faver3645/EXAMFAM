import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes } from "./TakeQuizService"; // <-- bruk tjenesten

const ListQuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quizzes.");
      }
    };

    loadQuizzes();
  }, []);

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Quizzes</h2>

      <div className="row">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div className="col-md-4 mb-3" key={quiz.QuizId}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{quiz.Title}</h5>
                  <div className="mt-auto">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => navigate(`/takequiz/take/${quiz.QuizId}`)}
                    >
                      Start Quiz
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/takequiz/${quiz.QuizId}/attempts`)}
                    >
                      View Attempts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No quizzes available.</p>
        )}
      </div>
    </div>
  );
};

export default ListQuizPage;
