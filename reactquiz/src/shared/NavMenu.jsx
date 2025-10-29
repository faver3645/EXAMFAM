import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // For React Router-kompatible lenker

export default function NavMenu() {
  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm mb-4">
      <Container>
        {/* Brand */}
        <LinkContainer to="/">
          <Navbar.Brand>MyQuiz 🎓</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left-side nav links */}
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/quizcreate">
              <Nav.Link>Create Quiz</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/quiz">
              <Nav.Link>Manage Quizzes</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/takequiz">
              <Nav.Link>Take Quiz</Nav.Link>
            </LinkContainer>

            {/* Optional dropdown */}
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

          {/* Right-side nav (optional login/profile buttons) */}
          <Nav>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
