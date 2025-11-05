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
    let message = "Registration failed";
    try {
      const err = await response.json();
      if (Array.isArray(err)) {
        message = err.map(e => e.Description).join(", ");
      } else if (err.message) {
        message = err.message;
      }
    } catch {
      // Ikke JSON, behold generic message
    }
    throw new Error(message);
  }
};

export default { login, register };
