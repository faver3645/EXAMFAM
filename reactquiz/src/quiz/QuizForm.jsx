import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const QuizForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [questionErrors, setQuestionErrors] = useState([]);
  const navigate = useNavigate(); 

  // Sett initial state når initialData endres (for update)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setQuestions(initialData.questions?.map(q => ({
        text: q.text || '',
        answerOptions: q.answerOptions?.map(a => ({
          text: a.text || '',
          isCorrect: a.isCorrect || false
        })) || []
      })) || []);
    } else {
      // Tomt skjema for ny quiz
      setQuestions([{
        text: '',
        answerOptions: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      }]);
    }
  }, [initialData]);

  // --- Spørsmål ---
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

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // --- Svaralternativer ---
  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    const newQuestions = [...questions];

    if (field === 'isCorrect' && value) {
      // Kun ett korrekt svar per spørsmål
      newQuestions[questionIndex].answerOptions = newQuestions[questionIndex].answerOptions.map((a, i) => ({
        ...a,
        isCorrect: i === answerIndex
      }));
    } else {
      newQuestions[questionIndex].answerOptions[answerIndex][field] = value;
    }

    setQuestions(newQuestions);
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions.splice(answerIndex, 1);
    setQuestions(newQuestions);
  };

  // --- Validering før submit ---
  const validate = () => {
    let valid = true;
    let qErrors = [];

    // Title validering
    if (!/^[0-9a-zA-ZæøåÆØÅ. \-]{2,20}$/.test(title)) {
      setTitleError('Title must be 2–20 characters, letters or numbers.');
      valid = false;
    } else {
      setTitleError('');
    }

    // Spørsmål validering
    questions.forEach((q, i) => {
      let err = '';
      if (!q.text.trim()) err += 'Question text is required. ';
      const correctCount = q.answerOptions.filter(a => a.isCorrect).length;
      if (correctCount === 0) err += 'One correct answer required. ';
      if (correctCount > 1) err += 'Only one correct answer allowed. ';
      q.answerOptions.forEach((a, j) => {
        if (!a.text.trim()) err += `Answer ${j + 1} text is required. `;
      });
      qErrors[i] = err;
      if (err) valid = false;
    });

    setQuestionErrors(qErrors);
    return valid;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const quizData = { title, questions };

    try {
      console.log("Submitting quiz data:", quizData); 
      await onSubmit(quizData);
    } catch (err) {
      console.error("Error submitting quiz:", err);
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
            isInvalid={!!titleError}
          />
          {titleError && <div className="invalid-feedback">{titleError}</div>}
        </Form.Group>

        {questions.map((q, i) => (
          <Card key={i} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Question {i + 1}</Form.Label>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger"
                  onClick={() => handleDeleteQuestion(i)}
                  disabled={questions.length <= 1}
                >
                  Delete Question
                </Button>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter question text"
                value={q.text}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
                isInvalid={!!questionErrors[i]}
              />
              {questionErrors[i] && (
                <div className="text-danger mt-1">{questionErrors[i]}</div>
              )}

              <div className="ms-3 mt-2">
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
                    />
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger ms-2"
                      onClick={() => handleDeleteAnswer(i, j)}
                      disabled={q.answerOptions.length <= 1}
                    >
                      Delete
                    </Button>
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

        <Button variant="secondary" onClick={handleAddQuestion} className="me-2 mt-2">
          Add Question
        </Button>

        <Button variant="primary" type="submit" className="me-2 mt-2" disabled={saving}>
          {saving ? 'Saving...' : 'Save Quiz'}
        </Button>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <Button variant="secondary" size="md" onClick={() => navigate('/quiz')}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default QuizForm;