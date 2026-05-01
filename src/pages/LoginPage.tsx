import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/authApi";

function saveTokenToCookie(token: string) {
  document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=3600; SameSite=Lax`;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginAdmin({
        login,
        password
      });

      saveTokenToCookie(response.accessToken);
      navigate("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Не удалось выполнить вход");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="page-card auth-card">
      <div className="page-intro">
        <div>
          <h1>Вход администратора</h1>
          <p>Введите логин и пароль администратора, чтобы перейти к панели управления.</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-group">
          <span className="field-label">Логин</span>
          <input
            className="text-input"
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="field-group">
          <span className="field-label">Пароль</span>
          <input
            className="text-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </section>
  );
}
