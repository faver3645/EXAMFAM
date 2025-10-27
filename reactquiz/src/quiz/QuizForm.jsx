import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const QuizForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      answerOptions: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);
  const [saving, setSaving] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        answerOptions: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions.push({
      text: '',
      isCorrect: false,
    });
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions[answerIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const quizData = {
      title,
      questions,
    };

    try {
      await onSubmit(quizData); // Kaller parent-funksjonen (fra QuizCreatePage)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Quiz Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {questions.map((q, i) => (
          <Card key={i} className="mb-3">
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Question {i + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter question text"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                  required
                />
              </Form.Group>

              <div className="ms-3">
                {q.answerOptions.map((a, j) => (
                  <div key={j} className="d-flex align-items-center mb-2">
                    <Form.Check
                      type="checkbox"
                      className="me-2"
                      checked={a.isCorrect}
                      onChange={(e) =>
                        handleAnswerChange(i, j, 'isCorrect', e.target.checked)
                      }
                      label="Correct"
                    />
                    <Form.Control
                      type="text"
                      placeholder="Answer text"
                      value={a.text}
                      onChange={(e) =>
                        handleAnswerChange(i, j, 'text', e.target.value)
                      }
                      required
                    />
                  </div>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddAnswer(i)}
                >
                  Add Answer
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}

        <Button
          variant="secondary"
          onClick={handleAddQuestion}
          className="me-2 mt-2"
        >
          Add Question
        </Button>

        <Button
          variant="primary"
          type="submit"
          className="me-2 mt-2"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Quiz'}
        </Button>
      </Form>
    </div>
  );
};

export default QuizForm;