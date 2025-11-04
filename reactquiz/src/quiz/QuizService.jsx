const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};


const handleResponse = async (response) => {
  if (response.ok) {
    if (response.status === 204) return null; 
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
};

// get all quizzes
export const fetchQuizzes = async () => {
  const response = await fetch(`${API_URL}/api/quizapi/quizlist`);
  return handleResponse(response);
};

// get quiz by id
export const fetchQuizById = async (quizId) => {
  const response = await fetch(`${API_URL}/api/quizapi/${quizId}`);
  return handleResponse(response);
};

// create quiz
export const createQuiz = async (quiz) => {
  const response = await fetch(`${API_URL}/api/quizapi/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(quiz),
  });
  return handleResponse(response);
};

// update quiz
export const updateQuiz = async (quizId, quiz) => {
  const response = await fetch(`${API_URL}/api/quizapi/update/${quizId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(quiz),
  });
  return handleResponse(response);
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
  const response = await fetch(`${API_URL}/api/quizapi/delete/${quizId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
