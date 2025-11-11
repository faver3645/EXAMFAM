import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

export default function HelpPage() {
  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Help & FAQ</h2>
      <p className="text-center text-muted mb-5">
        Find answers to common questions about using MyQuiz, whether you're a teacher or a student.
      </p>

      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I create a quiz as a teacher?</Accordion.Header>
          <Accordion.Body>
            Go to "Create Quiz" from the navbar. Enter a title, add questions with answer options, 
            and mark the correct answers. Click "Save Quiz" to add it to your dashboard. 
            You can edit quizzes later from "Manage Quizzes".
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I take a quiz as a student?</Accordion.Header>
          <Accordion.Body>
            Navigate to "Take Quiz" from the navbar. Select a quiz, answer the questions, 
            and submit to receive your score instantly. Your progress is tracked automatically.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Can I edit a quiz after creating it?</Accordion.Header>
          <Accordion.Body>
            Yes, teachers can update quizzes anytime from "Manage Quizzes". 
            Make your changes and click "Save" to update the quiz.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Who can see my quizzes?</Accordion.Header>
          <Accordion.Body>
            Teachers can see all their created quizzes. Students can only access quizzes available to them. 
            Sharing quizzes with others externally is not implemented yet.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>How is my progress tracked?</Accordion.Header>
          <Accordion.Body>
            Students’ quiz attempts and scores can get saved.
            Teachers can view all attempts for their quizzes in the dashboard.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
