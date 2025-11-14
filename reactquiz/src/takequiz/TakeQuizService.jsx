const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Network response was not ok");
  }
  return response.status === 204 ? null : response.json();
};

// --- API funksjoner ---
export const fetchAvailableQuizzes = async (token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/takequizlist`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const fetchQuizById = async (quizId, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/${quizId}`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const submitQuiz = async (payload, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/submit`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const saveAttempt = async (payload, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/saveattempt`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      QuizId: payload.QuizId,
      Score: payload.Score,
      TimeUsedSeconds: payload.TimeUsedSeconds,  // <-- legg til denne
    }),
  });
  return handleResponse(response);
};


export const fetchAttempts = async (quizId, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/attempts/${quizId}`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const deleteAttempt = async (attemptId, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/attempt/${attemptId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  return handleResponse(response);
};
