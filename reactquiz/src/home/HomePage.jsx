import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center text-center">
      <div className="container py-5">
        <h1 className="display-4 fw-bold text-primary mb-4">Welcome to MyQuiz 🎓</h1>
        <p className="lead text-secondary mb-5">
          Create and take quizzes easily! Build your own quiz sets, test your knowledge, and challenge friends.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {user?.role === "Teacher" && (
            <>
              <Button variant="primary" size="lg" onClick={() => navigate("/quizcreate")}>
                Create Quiz
              </Button>
              <Button variant="success" size="lg" onClick={() => navigate("/quiz")}>
                Manage Quizzes
              </Button>
            </>
          )}

          {user?.role === "Student" && (
            <Button variant="success" size="lg" onClick={() => navigate("/takequiz")}>
              Take Quiz
            </Button>
          )}

          {!user && (
            <>
              <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="success" size="lg" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>

      <section className="bg-white py-5 border-top">
        <div className="container">
          <h2 className="fw-semibold mb-4">Why use MyQuiz?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 shadow-sm rounded bg-light h-100">
                <h5 className="fw-bold mb-2 text-primary">Create quizzes easily</h5>
                <p className="text-muted">
                  Add questions, answers, and point values in an intuitive interface — no coding required.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 shadow-sm rounded bg-light h-100">
                <h5 className="fw-bold mb-2 text-primary">Take interactive quizzes</h5>
                <p className="text-muted">
                  Answer dynamically generated questions and get instant feedback and scoring.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 shadow-sm rounded bg-light h-100">
                <h5 className="fw-bold mb-2 text-primary">Track your progress</h5>
                <p className="text-muted">
                  Scores are saved so you can monitor improvement and challenge yourself again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
