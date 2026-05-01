import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="app-header">
      <div>
        <Link to="/" className="app-title">
          Файловый менеджер
        </Link>
        <p className="app-subtitle">Л.Р. №1 на React + TypeScript</p>
      </div>
      <nav className="header-nav">
        <Link to="/" className="header-link">
          Корневая папка
        </Link>
        <Link to="/login" className="header-link">
          Вход
        </Link>
      </nav>
    </header>
  );
}
