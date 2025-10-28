import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

export default function HelpPage() {
  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Help & FAQ</h2>
      <p className="text-center text-muted mb-4">
        Find answers to the most common questions about using MyQuiz.
      </p>

      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I create a quiz?</Accordion.Header>
          <Accordion.Body>
            Navigate to "Create Quiz" from the navbar. Add a title, questions, answer options, and select the correct answers. 
            Click "Save Quiz" to store it.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I take a quiz?</Accordion.Header>
          <Accordion.Body>
            Go to "Manage Quizzes", select a quiz, and click "Take Quiz". Answer the questions and submit to see your score.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Can I edit a quiz after creating it?</Accordion.Header>
          <Accordion.Body>
            Yes! From "Manage Quizzes", click "Update" on the quiz you want to modify. Make your changes and save.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Who can see my quizzes?</Accordion.Header>
          <Accordion.Body>
            Quizzes you create are visible to you. You can share them with others via the app or external links if implemented.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
