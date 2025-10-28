import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaGraduationCap, FaLightbulb, FaUsers } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">About MyQuiz</h2>
      <p className="text-center text-muted mb-5">
        MyQuiz is a web-based platform that allows you to create, manage, and take quizzes easily. 
        Whether you're a teacher, student, or trivia enthusiast, MyQuiz helps you learn and have fun.
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm text-center p-3">
            <FaGraduationCap size={40} className="text-primary mb-3" />
            <Card.Title>Learn Anywhere</Card.Title>
            <Card.Text>
              Take quizzes and track your learning progress anytime, anywhere, on any device.
            </Card.Text>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm text-center p-3">
            <FaLightbulb size={40} className="text-warning mb-3" />
            <Card.Title>Innovative Quizzes</Card.Title>
            <Card.Text>
              Create interactive quizzes with multiple questions, answer options, and scoring.
            </Card.Text>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm text-center p-3">
            <FaUsers size={40} className="text-success mb-3" />
            <Card.Title>Collaborate & Share</Card.Title>
            <Card.Text>
              Share your quizzes with friends, classmates, or the community to challenge each other.
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
