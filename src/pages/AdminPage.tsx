import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTextFileChanges, type TextFileChange } from "../api/adminApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { formatDate } from "../types/storage";

function getCookieValue(name: string): string | null {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=")[1]);
}

export function AdminPage() {
  const [changes, setChanges] = useState<TextFileChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadChanges() {
    const token = getCookieValue("accessToken");

    if (!token) {
      setError("Необходимо войти как администратор");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getTextFileChanges(token);
      setChanges(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить данные админ-панели");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadChanges();
  }, []);

  return (
    <section className="page-card">
      <div className="page-intro">
        <div>
          <h1>Панель администратора</h1>
          <p>Здесь показаны сохраненные пользователями изменения текстовых файлов.</p>
        </div>
        {/* <Link to="/login" className="header-link">
          Вход
        </Link> */}
      </div>

      {isLoading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={() => void loadChanges()} /> : null}

      {!isLoading && !error && changes.length === 0 ? (
        <p className="empty-state">Измененных текстовых файлов пока нет.</p>
      ) : null}

      {!isLoading && !error && changes.length > 0 ? (
        <section className="admin-list">
          {changes.map((change) => (
            <article className="details-card admin-change-card" key={change.id}>
              <div className="item-card-row">
                <h2>{change.fileName}</h2>
                <span className="item-badge">TXT</span>
              </div>
              <p className="item-meta">ID файла: {change.fileId}</p>
              <p className="item-meta">Дата изменения: {formatDate(change.changedAt)}</p>
              <pre className="admin-change-content">{change.newContent}</pre>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
