import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5082'

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchQuizzes = async () => {
    setLoading(true); // Set loading to true when starting the fetch
    setError(null);   // Clear any previous errors

    try {
      const response = await fetch(`${API_URL}/api/quizapi/quizlist`); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setQuizzes(data);
      console.log(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch quizzes.');
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };  
  useEffect(() => {
    fetchQuizzes();
  }, []);

   const filteredQuizzes = quizzes.filter(quiz =>
    quiz.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>All Quizzes</h2>
      <Button onClick={fetchQuizzes} className="btn btn-primary mb-3" disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Quizzes'}
      </Button>
      <Form.Group className="mb-3">        
      <Form.Control
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />  
      </Form.Group>       
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Quiz ID</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.map((quiz) => (
            <tr key={quiz.QuizId}>
              <td>{quiz.QuizId}</td>
              <td>{quiz.Title}</td>
              <td className="text-center">
                {/* Details-knapp */}
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/quizdetails/${quiz.QuizId}`)}
                >
                  Details
                </Button>

                {/* Update-knapp */}
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/quizupdate/${quiz.QuizId}`)}
                >
                  Update
                </Button>

                {/* Delete-knapp */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onItemDeleted(quiz.QuizId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
       <Button href='/quizcreate' className="btn btn-secondary mt-3">Create quiz</Button>  
    </div>
  );
};

export default QuizListPage;