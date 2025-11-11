import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUserGraduate, FaTrophy } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">About MyQuiz</h2>
      <p className="text-center text-muted mb-5">
        MyQuiz is a modern platform designed for both teachers and students. 
        Teachers can easily create and manage quizzes, while students can take quizzes and track their progress — all in one place.
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm text-center p-4 rounded-4">
            <FaChalkboardTeacher size={50} className="text-primary mb-3" />
            <Card.Title>Create & Manage Quizzes</Card.Title>
            <Card.Text>
              Teachers can build quizzes effortlessly, add questions and answers, and manage them in one central dashboard.
            </Card.Text>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm text-center p-4 rounded-4">
            <FaUserGraduate size={50} className="text-success mb-3" />
            <Card.Title>Learn & Improve</Card.Title>
            <Card.Text>
              Students can take quizzes, receive instant feedback, and track their learning progress over time.
            </Card.Text>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm text-center p-4 rounded-4">
            <FaTrophy size={50} className="text-warning mb-3" />
            <Card.Title>Stay Motivated</Card.Title>
            <Card.Text>
              Track achievements, challenge yourself, and stay motivated to reach new learning goals with MyQuiz.
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
