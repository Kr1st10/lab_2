import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page-card not-found-card">
      <h1>404</h1>
      <p>Такой страницы не существует.</p>
      <Link to="/" className="primary-button link-button">
        Вернуться на главную
      </Link>
    </section>
  );
}

