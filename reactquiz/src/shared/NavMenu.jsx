import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../auth/useAuth";
import AuthSection from "../auth/AuthSection";

export default function NavMenu() {
  const { user } = useAuth();

  const isTeacher = user?.role?.toLowerCase() === "teacher";
  const isStudent = user?.role?.toLowerCase() === "student";

  return (
    <Navbar expand="lg" sticky="top" bg="light" className="shadow-sm mb-4">
      <Container>
        {/* Brand */}
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold text-primary fs-4">MyQuiz 🎓</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left-side links */}
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link className="fw-medium text-dark">Home</Nav.Link>
            </LinkContainer>

            {isTeacher && (
              <>
                <LinkContainer to="/quizcreate">
                  <Nav.Link className="fw-medium text-dark">Create Quiz</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/quiz">
                  <Nav.Link className="fw-medium text-dark">Manage Quizzes</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/teacher-dashboard">
                  <Nav.Link className="fw-medium text-dark">View Attempts</Nav.Link>
                </LinkContainer>
              </>
            )}

            {isStudent && (
              <LinkContainer to="/takequiz">
                <Nav.Link className="fw-medium text-dark">Take Quiz</Nav.Link>
              </LinkContainer>
            )}

            <NavDropdown title="More" id="nav-dropdown">
              <LinkContainer to="/about">
                <NavDropdown.Item>About</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/help">
                <NavDropdown.Item>Help</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/contact">
                <NavDropdown.Item>Contact</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>

          {/* Right-side: AuthSection */}
          <AuthSection />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
