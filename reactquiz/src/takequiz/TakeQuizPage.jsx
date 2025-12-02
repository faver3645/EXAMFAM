import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../auth/useAuth";
import { fetchQuizById, submitQuiz } from "./TakeQuizService";

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const { token } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [unanswered, setUnanswered] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0); 
  const navigate = useNavigate();

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId, token);
        setQuiz(data);

        // Start timer
        startTimeRef.current = Date.now();

        // Start interval to update time spent
        timerRef.current = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTimeUsed(elapsedSeconds);
        }, 1000);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz.");
      }
    };
    getQuiz();

    // Cleanup upon unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizId, token]);

  const handleAnswerChange = (questionId, answerOptionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerOptionId }));
    if (unanswered.includes(questionId)) {
      setUnanswered((prev) => prev.filter((id) => id !== questionId));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz) return;

    const missing = quiz.Questions
      .filter((q) => !(q.QuestionId in answers))
      .map((q) => q.QuestionId);

    if (missing.length > 0) {
      setUnanswered(missing);
      setError("Please answer all questions before submitting.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = { 
      QuizId: quiz.QuizId, 
      Answers: answers,
      TimeUsedSeconds: timeUsed,  
    };

    try {
      const result = await submitQuiz(payload, token);

      // Stop timer when finished
      if (timerRef.current) clearInterval(timerRef.current);

      // Send time spent in navigate state with correct name
      navigate(`/takequiz/result/${quiz.QuizId}`, {
      state: { quiz, score: result.score ?? 0, timeUsedSeconds: timeUsed, answers }
    });
    } catch (err) {
      console.error(err);
      setError("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !quiz) {
    return <p className="text-center text-danger">{error}</p>;
  }

  if (!quiz) return <div className="text-center"> 
  <Spinner animation="border" size="sm" /> Loading quiz...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4 text-center">{quiz.Title}</h2>

      <p className="text-center mb-3"><strong>Time Used:</strong> {formatTime(timeUsed)}</p>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        {quiz.Questions.map((q, index) => (
          <div
            key={q.QuestionId}
            className={`card mb-4 shadow-sm ${
              unanswered.includes(q.QuestionId) ? "border-danger" : ""
            }`}
          >
            <div className="card-body">
              <h5 className="card-title">
                Question {index + 1}: {q.Text}
              </h5>

              {q.ImageUrl && (
                <div className="mb-3 text-center">
                  <img
                    src={`http://localhost:5082${q.ImageUrl}`}
                    alt={`Question ${index + 1}`}
                    className="img-fluid"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                </div>
              )}

              {q.AnswerOptions.map((option) => (
                <div className="form-check mb-2" key={option.AnswerOptionId}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`answers_${q.QuestionId}`}
                    id={`q${q.QuestionId}_a${option.AnswerOptionId}`}
                    value={option.AnswerOptionId}
                    checked={answers[q.QuestionId] === option.AnswerOptionId}
                    onChange={() =>
                      handleAnswerChange(q.QuestionId, option.AnswerOptionId)
                    }
                    disabled={submitting}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`q${q.QuestionId}_a${option.AnswerOptionId}`}
                  >
                    {option.Text}
                  </label>
                </div>
              ))}

              {unanswered.includes(q.QuestionId) && (
                <span className="text-danger d-block mt-2">
                  Please select an answer for this question.
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-success btn-md"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-md ms-2"
            onClick={() => navigate("/takequiz")}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeQuizPage;
