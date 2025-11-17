import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const QuizForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [questionErrors, setQuestionErrors] = useState([]);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [imageValidationLoading, setImageValidationLoading] = useState({});
  const navigate = useNavigate();
  const questionRefs = useRef([]);

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

  // Questions handlers
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
    validateImageUrlServer(index, value);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    const newErrors = [...questionErrors];
    newErrors.splice(index, 1);
    setQuestionErrors(newErrors);
  };

  // Answer handlers
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

  // Image URL client-side format validator
  const validateImageFormat = (url) => {
    if (!url) return true;
    const regex = /\.(jpg|jpeg|png|gif)$/i;
    return regex.test(url);
  };

  // Image validation via server API
  const validateImageUrlServer = async (qIndex, url) => {
    if (!url || !url.startsWith('/images/')) return;

    setImageValidationLoading(prev => ({ ...prev, [qIndex]: true }));

    try {
      const res = await fetch(`${API_URL}/api/takequizapi/validateimage?imageUrl=${encodeURIComponent(url)}`);
      const data = await res.json();

      const newErrors = [...questionErrors];
      if (!newErrors[qIndex]) newErrors[qIndex] = { text: '', imageUrl: '', answers: [] };

      if (!data.valid) {
        newErrors[qIndex].imageUrl = data.message || 'Image not found on server.';
      } else {
        if (newErrors[qIndex].imageUrl?.includes('ikke')) newErrors[qIndex].imageUrl = '';
      }

      setQuestionErrors(newErrors);
    } catch (err) {
      console.error('Image validation failed', err);
    } finally {
      setImageValidationLoading(prev => ({ ...prev, [qIndex]: false }));
    }
  };

  // Form validation
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
      let errs = { text: '', imageUrl: '', answers: [] };

      if (!q.text.trim()) errs.text = 'Question text is required.';

      const correctCount = q.answerOptions.filter(a => a.isCorrect).length;
      if (correctCount === 0) errs.answersGeneral = 'One correct answer required.';
      if (correctCount > 1) errs.answersGeneral = 'Only one correct answer allowed.';

      errs.answers = q.answerOptions.map(a => (!a.text.trim() ? 'Answer text required.' : ''));

      if (q.imageUrl && !validateImageFormat(q.imageUrl)) errs.imageUrl = 'Invalid image URL. Must end with .jpg, .jpeg, .png, or .gif';

      qErrors[i] = errs;
      if (errs.text || errs.imageUrl || errs.answers.some(a => a) || errs.answersGeneral) valid = false;
    });

    setQuestionErrors(qErrors);
    return valid;
  };

  const scrollToFirstError = () => {
    if (titleError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    for (let i = 0; i < questionRefs.current.length; i++) {
      const ref = questionRefs.current[i];
      if (!ref) continue;
      const errs = questionErrors[i];
      if (errs && (errs.text || errs.imageUrl || errs.answers.some(a => a) || errs.answersGeneral)) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrorMessage('');

    if (!validate()) {
      scrollToFirstError();
      return;
    }

    // Check if any image validation is still in progress
    const loadingKeys = Object.keys(imageValidationLoading).filter(k => imageValidationLoading[k]);
    if (loadingKeys.length > 0) {
      alert('Please wait for image validation to complete.');
      return;
    }

    // Check if any image validation errors exist
    const hasImageErrors = questionErrors.some(q => q.imageUrl);
    if (hasImageErrors) {
      scrollToFirstError();
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ title, questions });
    } catch (err) {
      let data;
      try {
        data = await err.json();
      } catch {
        data = null;
      }

      const serverErrors = data?.errors || {};
      if (Object.keys(serverErrors).length > 0) {
        const newQuestionErrors = [...questionErrors];
        Object.keys(serverErrors).forEach(key => {
          const match = key.match(/Questions\[(\d+)\]\.(\w+)/);
          if (!match) return;
          const qIndex = parseInt(match[1]);
          const field = match[2];
          const message = serverErrors[key][0];

          if (!newQuestionErrors[qIndex]) newQuestionErrors[qIndex] = { text: '', imageUrl: '', answers: [] };
          if (field === 'ImageUrl') newQuestionErrors[qIndex].imageUrl = message;
          else newQuestionErrors[qIndex].text = message;
        });
        setQuestionErrors(newQuestionErrors);
        scrollToFirstError();
      } else {
        setServerErrorMessage('An unexpected error occurred. Please try again.');
      }
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
        <Card key={i} className="mb-3" ref={el => questionRefs.current[i] = el}>
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
              isInvalid={!!questionErrors[i]?.text}
            />
            {questionErrors[i]?.text && <div className="text-danger mt-1">{questionErrors[i].text}</div>}

            <Form.Control
              type="text"
              placeholder="Enter image URL (optional)"
              value={q.imageUrl || ''}
              onChange={(e) => handleQuestionImageChange(i, e.target.value)}
              className="mt-2"
              isInvalid={!!questionErrors[i]?.imageUrl}
            />
            {imageValidationLoading[i] && <Spinner animation="border" size="sm" className="ms-2" />}
            {questionErrors[i]?.imageUrl && <div className="text-danger mt-1">{questionErrors[i].imageUrl}</div>}

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
                    className={questionErrors[i]?.answers[j] ? 'border-danger' : ''}
                    isInvalid={!!questionErrors[i]?.answers[j]}
                  />
                  {questionErrors[i]?.answers[j] && (
                    <div className="text-danger mt-1">{questionErrors[i].answers[j]}</div>
                  )}
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
              {questionErrors[i]?.answersGeneral && (
                <div className="text-danger mt-1">{questionErrors[i].answersGeneral}</div>
              )}
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

      {serverErrorMessage && (
        <div className="alert alert-danger mt-3">{serverErrorMessage}</div>
      )}

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
