import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFileById, updateTextFileContent } from "../api/storageApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { FileViewerWidget } from "../components/FileViewerWidget";
import { Loader } from "../components/Loader";
import { formatDate, formatFileSize, getFileTypeLabel, type FileItem } from "../types/storage";

export function FilePage() {
  const { id } = useParams();
  const fileId = Number(id);
  const [file, setFile] = useState<FileItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadFile() {
    if (Number.isNaN(fileId)) {
      setError("Файл не найден");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getFileById(fileId);
      setFile(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(nextContent: string) {
    if (!file) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      const updatedFile = await updateTextFileContent(file.id, nextContent);
      setFile(updatedFile);
      setSuccessMessage("Изменения успешно сохранены");
    } catch (saveRequestError) {
      setSaveError(saveRequestError instanceof Error ? "Не удалось сохранить изменения" : "Не удалось сохранить изменения");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    void loadFile();
  }, [fileId]);

  return (
    <section className="page-card">
      <div className="page-intro">
        <div>
          <h1>{file?.name ?? "Страница файла"}</h1>
          <p>Здесь показана подробная информация о выбранном файле и область просмотра.</p>
        </div>
        <Link to="/" className="header-link">
          В корень
        </Link>
      </div>

      {isLoading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={() => void loadFile()} /> : null}

      {!isLoading && !error && file ? (
        <div className="page-columns">
          <section className="details-card">
            <h2>Информация о файле</h2>
            <p>
              <strong>ID:</strong> {file.id}
            </p>
            <p>
              <strong>Название:</strong> {file.name}
            </p>
            <p>
              <strong>Тип:</strong> {getFileTypeLabel(file.fileType)}
            </p>
            <p>
              <strong>Размер:</strong> {formatFileSize(file.size)}
            </p>
            <p>
              <strong>Путь:</strong> {file.path}
            </p>
            <p>
              <strong>Дата изменения:</strong> {formatDate(file.updatedAt)}
            </p>
            <p>
              <strong>Где хранится:</strong> {file.fileType === "text" ? "content в db.json" : file.url ?? "Локальный файл"}
            </p>
            {successMessage ? <p className="success-text">{successMessage}</p> : null}
          </section>

          <FileViewerWidget file={file} onSave={handleSave} isSaving={isSaving} saveError={saveError} />
        </div>
      ) : null}
    </section>
  );
}
