import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from './QuizForm'; // Importer skjema-komponenten vi lagde tidligere

const API_URL = 'http://localhost:5082'; // Hardkodet URL til API-et

const QuizCreatePage = () => {
  const navigate = useNavigate();

  const handleQuizCreated = async (quiz) => {
    try {
      const response = await fetch(`${API_URL}/api/QuizAPI/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Quiz created successfully:', data);

      // Naviger tilbake til quiz-listen
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