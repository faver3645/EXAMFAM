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

// Fetch attempts with paging, search and sort
export const fetchAttempts = async (quizId, token, page = 1, pageSize = 6, sort = "date_desc", search = "") => {
  const params = new URLSearchParams({
    page,
    pageSize,
    sortBy: sort.includes("score") ? "score" : "submittedAt",
    sortOrder: sort.endsWith("_asc") ? "asc" : "desc",
  });

  if (search && search.trim() !== "") {
    params.append("search", search.trim());
  }

  const finalUrl = `${API_URL}/api/takequizapi/attempts/${quizId}?${params.toString()}`;
  console.log("🌐 FINAL REQUEST URL:", finalUrl);

  const response = await fetch(finalUrl, { headers: getHeaders(token) });
  return handleResponse(response);
};

export const deleteAttempt = async (attemptId, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/attempt/${attemptId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const fetchAvailableQuizzes = async (token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/takequizlist`, { headers: getHeaders(token) });
  return handleResponse(response);
};

export const fetchQuizById = async (quizId, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/${quizId}`, { headers: getHeaders(token) });
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
      TimeUsedSeconds: payload.TimeUsedSeconds,
      Answers: payload.Answers,
    }),
  });
  return handleResponse(response);
};

export const fetchAttemptDetails = async (attemptId, token) => {
  const response = await fetch(`${API_URL}/api/takequizapi/attempt-details/${attemptId}`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};
