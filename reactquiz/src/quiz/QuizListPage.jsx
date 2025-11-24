import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Badge, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes, deleteQuiz } from "./QuizService";
import { useAuth } from "../auth/useAuth";
import { PencilSquare, Trash, Eye, PlusCircle, ArrowClockwise } from "react-bootstrap-icons";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAllQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuizzes();
      setQuizzes(data);
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
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      setError("Failed to delete quiz.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <h2>All Quizzes</h2>
        <div className="d-flex gap-2 flex-wrap">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={fetchAllQuizzes} disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <ArrowClockwise />
              )}
            </Button>
          </InputGroup>
          {user && (
            <Button variant="success" onClick={() => navigate("/quizcreate")}>
              <PlusCircle className="me-1" /> Create Quiz
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive shadow-sm rounded">
        <Table striped hover bordered className="align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>#ID</th>
              <th>Title</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  <Spinner animation="border" size="sm" /> Loading quizzes...
                </td>
              </tr>
            ) : filteredQuizzes.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-3">No quizzes found.</td>
              </tr>
            ) : (
              filteredQuizzes.map((quiz) => (
                <tr key={quiz.QuizId}>
                  <td>
                    <Badge bg="info">{quiz.QuizId}</Badge>
                  </td>
                  <td>{quiz.Title}</td>
                  <td className="text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2 mb-1"
                      onClick={() => navigate(`/quizdetails/${quiz.QuizId}`)}
                    >
                      <Eye /> Details
                    </Button>
                    {user && (
                      <>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() => navigate(`/quizupdate/${quiz.QuizId}`)}
                        >
                          <PencilSquare /> Update
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="mb-1"
                          onClick={() => handleQuizDeleted(quiz.QuizId)}
                        >
                          <Trash /> Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default QuizListPage;
