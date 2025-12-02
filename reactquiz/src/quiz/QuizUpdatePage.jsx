import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from "react-bootstrap";
import QuizForm from './QuizForm';
import { fetchQuizById, updateQuiz } from './QuizService'; 
const QuizUpdatePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing quiz via QuizService
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId);

        // Adapt data for QuizForm
        const formattedQuiz = {
          title: data.Title,
          questions: data.Questions?.map(q => ({
            text: q.Text,
            imageUrl: q.ImageUrl || '',
            answerOptions: q.AnswerOptions?.map(a => ({
              text: a.Text,
              isCorrect: a.IsCorrect
            })) || []
          })) || []
        };

        setQuizData(formattedQuiz);
      } catch (err) {
        setError('Failed to load quiz');
        console.error('There was a problem with the fetch operation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Update quiz via QuizService
  const handleQuizUpdated = async (updatedQuiz) => {
    try {
      const data = await updateQuiz(quizId, updatedQuiz);
      console.log('Quiz updated successfully;', data);
      navigate('/quiz'); // Back to the quiz list
    } catch (err) {
      console.error('Failed to update quiz:', err);
      alert(`Failed to update quiz: ${err.message}`);
    }
  };

  if (loading) return <div>
    <Spinner animation="border" size="sm" /> Loading quiz...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Update Quiz</h2>
      <QuizForm onSubmit={handleQuizUpdated} initialData={quizData} />
    </div>
  );
};

export default QuizUpdatePage;
