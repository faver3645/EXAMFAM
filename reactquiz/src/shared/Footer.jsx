import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-light text-dark mt-auto pt-4 pb-3 border-top">
      <Container>
        <Row className="mb-3">
          {/* Brand / logo */}
          <Col md={4} className="mb-3 mb-md-0 text-center text-md-start">
            <h5 className="fw-bold">MyQuiz 🎓</h5>
            <p className="small text-muted">
              Create and take quizzes easily. Build your knowledge with MyQuiz.
            </p>
          </Col>

          {/* Quick links */}
          <Col md={4} className="mb-3 mb-md-0 text-center">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-dark text-decoration-none">Home</a></li>
              <li><a href="/quizcreate" className="text-dark text-decoration-none">Create Quiz</a></li>
              <li><a href="/quiz" className="text-dark text-decoration-none">Manage Quizzes</a></li>
              <li><a href="/contact" className="text-dark text-decoration-none">Contact</a></li>
            </ul>
          </Col>

          {/* Social icons */}
          <Col md={4} className="text-center text-md-end">
            <h6 className="fw-semibold">Follow Us</h6>
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mt-2">
              <a href="#" className="text-dark fs-5"><FaFacebookF /></a>
              <a href="#" className="text-dark fs-5"><FaTwitter /></a>
              <a href="#" className="text-dark fs-5"><FaLinkedinIn /></a>
              <a href="mailto:support@myquiz.com" className="text-dark fs-5"><FaEnvelope /></a>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} MyQuiz — All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
