import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthSection from '../auth/AuthSection'; // Legg til AuthSection

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
          {/* Venstre-side lenker */}
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

            {/* Dropdown */}
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

          {/* Høyre-side: AuthSection */}
          <AuthSection />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
 
