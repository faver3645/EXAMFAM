import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-light text-dark mt-auto py-3 border-top">
      <Container>
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} MyQuiz 🎓 — All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
