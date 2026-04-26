import { useEffect, useState } from "react";
import { getFileTypeLabel, type FileItem } from "../types/storage";

type FileViewerWidgetProps = {
  file: FileItem;
  onSave?: (nextContent: string) => Promise<void>;
  isSaving?: boolean;
  saveError?: string | null;
};

export function FileViewerWidget({ file, onSave, isSaving = false, saveError = null }: FileViewerWidgetProps) {
  const [textValue, setTextValue] = useState(file.content ?? "");

  useEffect(() => {
    setTextValue(file.content ?? "");
  }, [file.id, file.content]);

  const isTextFile = file.fileType === "text";
  const canSave = isTextFile && typeof onSave === "function";

  async function handleSave() {
    if (!canSave) {
      return;
    }

    await onSave(textValue);
  }

  return (
    <section className="viewer-card">
      <div className="viewer-header">
        <h2>FileViewerWidget</h2>
        <span className="viewer-label">{getFileTypeLabel(file.fileType)}</span>
      </div>

      {file.fileType === "text" ? (
        <div className="viewer-stack">
          <textarea
            className="viewer-textarea"
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            rows={14}
          />
          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
            disabled={!canSave || isSaving || textValue === (file.content ?? "")}
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
          {saveError ? <p className="error-text">{saveError}</p> : null}
        </div>
      ) : null}

      {file.fileType === "pdf" ? (
        <iframe className="viewer-frame" src={file.url} title={file.name} />
      ) : null}

      {file.fileType === "image" ? (
        <img className="viewer-image" src={file.url} alt={file.name} />
      ) : null}

      {file.fileType === "video" ? (
        <video className="viewer-media" src={file.url} controls>
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      ) : null}

      {file.fileType === "audio" ? (
        <audio className="viewer-audio" src={file.url} controls>
          Ваш браузер не поддерживает воспроизведение аудио.
        </audio>
      ) : null}

      {file.fileType === "document" || file.fileType === "other" ? (
        <p className="status-message">Предпросмотр недоступен для этого типа файла.</p>
      ) : null}
    </section>
  );
}

