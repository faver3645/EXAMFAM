const API_URL = import.meta.env.VITE_API_URL;

const login = async (data) => {
  const response = await fetch(`${API_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Login failed");
  const result = await response.json();
  return result.Token;
};

const register = async (data) => {
  const response = await fetch(`${API_URL}/api/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Registration failed");
  }
};

export default { login, register };
