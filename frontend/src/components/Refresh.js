 export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");

  const response = await fetch(
    "http://127.0.0.1:8000/api/token/refresh/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    }
  );

  if (!response.ok) {
    throw new Error("Refresh failed");
  }

  const data = await response.json();
  localStorage.setItem("access", data.access);
  return data.access;
};
