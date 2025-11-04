import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizForm from './QuizForm';
import { fetchQuizById, updateQuiz } from './QuizService'; 
const QuizUpdatePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hent eksisterende quiz via QuizService
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId);

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

    loadQuiz();
  }, [quizId]);

  // Oppdater quiz via QuizService
  const handleQuizUpdated = async (updatedQuiz) => {
    try {
      await updateQuiz(quizId, updatedQuiz);
      console.log('Quiz updated successfully');
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
