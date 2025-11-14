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

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setQuestions(
        initialData.questions?.map((q) => ({
          text: q.text || '',
          imageUrl: q.imageUrl || '',
          answerOptions:
            q.answerOptions?.map(a => ({
              text: a.text || '',
              isCorrect: a.isCorrect || false
            })) || []
        })) || []
      );
    } else {
      setQuestions([{
        text: '',
        imageUrl: '',
        answerOptions: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }]);
    }
  }, [initialData]);

  // questions
  const handleAddQuestion = () => {
    setQuestions([...questions, {
      text: '',
      imageUrl: '',
      answerOptions: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleQuestionImageChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].imageUrl = value;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // answer options
  const handleAddAnswer = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answerOptions.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, field, value) => {
    const newQuestions = [...questions];
    if (field === 'isCorrect' && value) {
      newQuestions[qIndex].answerOptions = newQuestions[qIndex].answerOptions.map(
        (a, i) => ({ ...a, isCorrect: i === aIndex })
      );
    } else {
      newQuestions[qIndex].answerOptions[aIndex][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleDeleteAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answerOptions.splice(aIndex, 1);
    setQuestions(newQuestions);
  };

  // Image URL Validator 
  const validateImageUrl = (url) => {
    if (!url) return true; // tom URL er tillatt
    const regex = /^(\/images\/[\w\-.]+|https?:\/\/[\w\-.]+(\.[\w\-.]+)+.*\.(jpg|jpeg|png|gif))$/i;
    return regex.test(url);
  };

  // Validation
  const validate = () => {
    let valid = true;
    let qErrors = [];

    if (!/^[0-9a-zA-ZæøåÆØÅ. -]{2,20}$/.test(title)) {
      setTitleError('Title must be 2 - 20 characters, letters or numbers.');
      valid = false;
    } else {
      setTitleError('');
    }

    questions.forEach((q, i) => {
      let err = '';

      if (!q.text.trim()) err += 'Question text is required. ';

      const correctCount = q.answerOptions.filter(a => a.isCorrect).length;
      if (correctCount === 0) err += 'One correct answer required. ';
      if (correctCount > 1) err += 'Only one correct answer allowed. ';

      q.answerOptions.forEach((a, j) => {
        if (!a.text.trim()) err += `Answer ${j + 1} text is required. `;
      });

      if (q.imageUrl && !validateImageUrl(q.imageUrl)) {
        err += 'Invalid image URL. ';
      }

      qErrors[i] = err;
      if (err) valid = false;
    });

    setQuestionErrors(qErrors);
    return valid;
  };

  // subit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const quizData = { title, questions };
    try {
      await onSubmit(quizData);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSaving(false);
    }
  };

  
  return (
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
            <Form.Control
              type="text"
              placeholder="Enter image URL (e.g., /images/q1.jpg)"
              value={q.imageUrl || ''}
              onChange={(e) => handleQuestionImageChange(i, e.target.value)}
              className="mt-2"
            />
            {questionErrors[i] && questionErrors[i].includes('Invalid image URL') && (
              <div className="text-danger mt-1">
                Invalid image URL. Must end with .jpg, .jpeg, .png, or .gif
              </div>
            )}
            {questionErrors[i] && !questionErrors[i].includes('Invalid image URL') && (
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
  );
};

export default QuizForm;
