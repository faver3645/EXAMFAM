import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes, deleteQuiz } from "./QuizService";
import { useAuth } from "../auth/AuthContext";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hent alle quizzes
  const fetchAllQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuizzes();
      setQuizzes(data);
      console.log(data);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      setError("Failed to fetch quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuizDeleted = async (quizId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete quiz ${quizId}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.QuizId !== quizId));
      console.log('Quiz deleted:', quizId);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      setError("Failed to delete quiz.");
    }
  };

  return (
    <div>
      <h2>All Quizzes</h2>
      <Button
        onClick={fetchAllQuizzes}
        className="btn btn-primary mb-3"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Quizzes"}
      </Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/quizdetails/${quiz.QuizId}`)}
                >
                  Details
                </Button>

                {/* Skjul Update og Delete hvis ikke logget inn */}
                {user && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/quizupdate/${quiz.QuizId}`)}
                    >
                      Update
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleQuizDeleted(quiz.QuizId)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Skjul Create-knappen hvis ikke logget inn */}
      {user && (
        <Button href="/quizcreate" className="btn btn-secondary mt-3">
          Create quiz
        </Button>
      )}
    </div>
  );
};

export default QuizListPage;