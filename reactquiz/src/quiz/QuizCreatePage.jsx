import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from './QuizForm'; 
import { createQuiz } from "./QuizService";

const QuizCreatePage = () => {
  const navigate = useNavigate();

  const handleQuizCreated = async (quiz) => {
    try {

      const data = await createQuiz(quiz);
      console.log('Quiz created successfully:', data);
      navigate('/quiz');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to create quiz. See console for details.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Quiz</h2>
      <QuizForm onSubmit={handleQuizCreated} />
    </div>
  );
};

export default QuizCreatePage;
