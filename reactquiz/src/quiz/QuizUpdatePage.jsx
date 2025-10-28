import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from './QuizForm';

const API_URL = 'http://localhost:5082';

const QuizUpdatePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hent eksisterende quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/api/quizapi/${quizId}`);
        if (!response.ok) throw new Error('Failed to fetch quiz');
        const data = await response.json();

        // Tilpass data for QuizForm
        const formattedQuiz = {
          title: data.Title,
          questions: data.Questions?.map(q => ({
            text: q.Text,
            answerOptions: q.AnswerOptions?.map(a => ({
              text: a.Text,
              isCorrect: a.IsCorrect
            })) || []
          })) || []
        };

        setQuizData(formattedQuiz);
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Funksjon for å oppdatere quiz
  const handleQuizUpdated = async (updatedQuiz) => {
    try {
      const response = await fetch(`${API_URL}/api/quizapi/update/${quizId}`, {
        method: 'PUT', // eller PATCH avhengig av backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuiz),
      });

      if (!response.ok) throw new Error('Failed to update quiz');

      const data = await response.json();
      console.log('Quiz updated successfully:', data);

      navigate('/quiz');
    } catch (err) {
      console.error(err);
      alert('Failed to update quiz. See console for details.');
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Update Quiz</h2>
      <QuizForm onSubmit={handleQuizUpdated} initialData={quizData} />
    </div>
  );
};

export default QuizUpdatePage;