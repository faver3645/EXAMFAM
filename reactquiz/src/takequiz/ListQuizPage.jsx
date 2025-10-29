import React from "react";
import { Link } from "react-router-dom";

function ListQuizPage({ quizzes }) {
  return (
    <div>
      <h2>Available Quizzes</h2>

      <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz.quizId} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>

                <Link
                  to={`/takequiz/take/${quiz.quizId}`}
                  className="btn btn-primary me-2"
                >
                  Start Quiz
                </Link>

                <Link
                  to={`/takequiz/attempts/${quiz.quizId}`}
                  className="btn btn-success"
                >
                  View Attempts
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListQuizPage;
