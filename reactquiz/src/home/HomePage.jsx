import React, { useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState("teacher"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded credentials for demo
  const credentials = {
    teacher: { email: "teacher@example.com", password: "teacher123" },
    student: { email: "student@example.com", password: "student123" },
  };

  const handleLoginOpen = () => {
    setShowLogin(true);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleLoginClose = () => setShowLogin(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === credentials[role].email && password === credentials[role].password) {
      alert(`Logged in successfully as ${role}!`);
      handleLoginClose();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center text-center">
      {/* Hero Section */}
      <div className="container py-5">
        <h1 className="display-4 fw-bold text-primary mb-4">Welcome to MyQuiz 🎓</h1>
        <p className="lead text-secondary mb-5">
          Create and take quizzes easily! Build your own quiz sets, test your knowledge, and challenge friends.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button variant="primary" size="lg" onClick={handleLoginOpen}>
            Login
          </Button>
        </div>
      </div>

      {/* Why use MyQuiz Section */}
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

      {/* Call to Action */}
      <section className="bg-primary text-light py-5">
        <div className="container">
          <h2 className="fw-semibold mb-3">Get Started</h2>
          <p className="mb-4">
            Whether you’re a student, teacher, or trivia lover — MyQuiz makes quiz creation fun and easy.
          </p>
          <Button variant="light" size="lg" onClick={handleLoginOpen}>
            Start Now
          </Button>
        </div>
      </section>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleLoginClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p className="text-danger mb-3">{error}</p>}

            <Button variant="primary" type="submit" className="w-100 mb-2">
              Login
            </Button>
          </Form>

          <p className="small mt-2 text-muted">
            Teacher: teacher@example.com / teacher123 <br />
            Student: student@example.com / student123
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
