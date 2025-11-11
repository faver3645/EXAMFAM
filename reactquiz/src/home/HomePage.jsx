import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { FaChalkboardTeacher, FaUserGraduate, FaBookOpen, FaTrophy } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ikke-innlogget bruker
  if (!user) {
    return (
      <div className="bg-white min-vh-100">
        <Container className="text-center py-5">
          <h1 className="display-3 fw-bold text-primary mb-3">MyQuiz 🎓</h1>
          <p className="lead text-secondary mb-4">
            Create quizzes, challenge yourself, and track your progress — all in one place.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap mb-5">
            <Button
              className="hero-button"
              style={{ background: "linear-gradient(135deg, #646cff, #535bf2)", border: "none" }}
              size="lg"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="hero-button"
              style={{ background: "linear-gradient(135deg, #28a745, #20c997)", border: "none" }}
              size="lg"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>

          <h2 className="fw-semibold mb-4">Why use MyQuiz?</h2>
          <Row className="text-center g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                <FaChalkboardTeacher size={50} className="text-primary mb-3" />
                <Card.Title>Create Quizzes Easily</Card.Title>
                <Card.Text>
                  Build quizzes quickly with an intuitive interface — no coding required.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                <FaUserGraduate size={50} className="text-success mb-3" />
                <Card.Title>Interactive Learning</Card.Title>
                <Card.Text>
                  Take quizzes and get instant feedback to improve your knowledge.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                <FaTrophy size={50} className="text-warning mb-3" />
                <Card.Title>Track Progress</Card.Title>
                <Card.Text>
                  Monitor your scores and see how you improve over time.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Innlogget bruker
  return (
    <div className="bg-white min-vh-100 py-5">
      <Container className="text-center">
        <header className="mb-5">
          <h1 className="display-3 fw-bold text-primary mb-3">
            Welcome, {user.name}!
          </h1>
          <p className="lead text-secondary">
            {user.role === "Teacher"
              ? "Manage your quizzes and students efficiently."
              : "Take quizzes and challenge yourself today."}
          </p>
        </header>

        {/* Rollebaserte handlingskort */}
        <Row className="g-4 justify-content-center mb-5">
          {user.role === "Teacher" && (
            <>
              <Col md={4}>
                <Card className="shadow-sm h-100 p-4" style={{ borderRadius: "16px" }}>
                  <FaChalkboardTeacher size={40} className="text-primary mb-3" />
                  <Card.Title>Create Quiz</Card.Title>
                  <Card.Text>
                    Quickly design quizzes and add new questions for your students.
                  </Card.Text>
                  <Button
                    style={{ background: "linear-gradient(135deg, #646cff, #535bf2)", border: "none" }}
                    size="sm"
                    onClick={() => navigate("/quizcreate")}
                  >
                    Create Now
                  </Button>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm h-100 p-4" style={{ borderRadius: "16px" }}>
                  <FaBookOpen size={40} className="text-success mb-3" />
                  <Card.Title>Manage Quizzes</Card.Title>
                  <Card.Text>
                    View all quizzes and edit them anytime.
                  </Card.Text>
                  <Button
                    style={{ background: "linear-gradient(135deg, #28a745, #20c997)", border: "none" }}
                    size="sm"
                    onClick={() => navigate("/quiz")}
                  >
                    Manage
                  </Button>
                </Card>
              </Col>
            </>
          )}

          {user.role === "Student" && (
            <Col md={4}>
              <Card className="shadow-sm h-100 p-4" style={{ borderRadius: "16px" }}>
                <FaUserGraduate size={40} className="text-success mb-3" />
                <Card.Title>Take Quiz</Card.Title>
                <Card.Text>
                  Start a quiz and improve your knowledge every day.
                </Card.Text>
                <Button
                  style={{ background: "linear-gradient(135deg, #28a745, #20c997)", border: "none" }}
                  size="sm"
                  onClick={() => navigate("/takequiz")}
                >
                  Start Quiz
                </Button>
              </Card>
            </Col>
          )}
        </Row>

        {/* Rollespesifikke seksjoner */}
        {user.role === "Student" && (
          <section className="bg-white py-5">
            <h2 className="fw-semibold mb-4">Stay Motivated</h2>
            <p className="text-muted mb-4">
              Keep learning, set goals, and track your progress over time. MyQuiz makes learning fun!
            </p>
            <FaTrophy size={60} className="text-warning" />
          </section>
        )}

        {user.role === "Teacher" && (
          <section className="bg-white py-5">
            <h2 className="fw-semibold mb-4">Enhance Your Classroom</h2>
            <p className="text-muted mb-4">
              Organize quizzes, monitor student performance, and provide feedback efficiently. MyQuiz helps you teach smarter.
            </p>
            <FaChalkboardTeacher size={60} className="text-primary" />
          </section>
        )}
      </Container>
    </div>
  );
}
