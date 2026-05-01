const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type LoginRequest = {
  login: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

export async function loginAdmin(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Неверный логин или пароль");
  }

  return (await response.json()) as LoginResponse;
}
