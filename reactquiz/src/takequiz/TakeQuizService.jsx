const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  "Content-Type": "application/json",
};

// Felles funksjon for håndtering av fetch-respons
const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Network response was not ok");
  }
  return response.status === 204 ? null : response.json();
};

// --- API-funksjoner ---

// Hent liste over tilgjengelige quizer
export const fetchAvailableQuizzes = async () => {
  const response = await fetch(`${API_URL}/api/takequizapi/takequizlist`);
  return handleResponse(response);
};

// Hent quiz etter ID
export const fetchQuizById = async (quizId) => {
  const response = await fetch(`${API_URL}/api/takequizapi/${quizId}`);
  return handleResponse(response);
};

// Send inn besvarelse for en quiz
export const submitQuiz = async (payload) => {
  const response = await fetch(`${API_URL}/api/takequizapi/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// Lagre resultat av en quiz (forsøk)
export const saveAttempt = async (payload) => {
  const response = await fetch(`${API_URL}/api/takequizapi/saveattempt`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// Hent alle forsøk for en quiz
export const fetchAttempts = async (quizId) => {
  const response = await fetch(`${API_URL}/api/takequizapi/attempts/${quizId}`);
  return handleResponse(response);
};

// Slett et spesifikt forsøk
export const deleteAttempt = async (attemptId) => {
  const response = await fetch(`${API_URL}/api/takequizapi/attempt/${attemptId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};
