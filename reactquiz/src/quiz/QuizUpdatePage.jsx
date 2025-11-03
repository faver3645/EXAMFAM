import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizForm from './QuizForm';

const API_URL = import.meta.env.VITE_API_URL;

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

  // Oppdater quiz via API
  const handleQuizUpdated = async (updatedQuiz) => {
    try {
      const response = await fetch(`${API_URL}/api/quizapi/update/${quizId}`, {
        method: 'PUT', // bruk PUT for oppdatering
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuiz),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to update quiz');
      }

      const data = await response.json();
      console.log('Quiz updated successfully:', data);

      navigate('/quiz'); // tilbake til quiz-listen
    } catch (err) {
      console.error(err);
      alert(`Failed to update quiz: ${err.message}`);
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