import { Link } from "react-router-dom";
import { formatDate, formatFileSize, getFileTypeLabel, isFileItem, type StorageItem } from "../types/storage";

type ItemCardProps = {
  item: StorageItem;
};

export function ItemCard({ item }: ItemCardProps) {
  const detailLink = item.kind === "folder" ? `/folders/${item.id}` : `/files/${item.id}`;

  return (
    <Link to={detailLink} className="item-card item-card-link">
      <div className="item-card-row">
        <span className={`item-badge ${item.kind === "folder" ? "folder-badge" : "file-badge"}`}>
          {item.kind === "folder" ? "Папка" : "Файл"}
        </span>
        <span className="item-link">{item.name}</span>
      </div>

      <p className="item-meta">Путь: {item.path}</p>

      {isFileItem(item) ? (
        <>
          <p className="item-meta">Тип: {getFileTypeLabel(item.fileType)}</p>
          <p className="item-meta">
            Размер: {formatFileSize(item.size)} • Изменен: {formatDate(item.updatedAt)}
          </p>
        </>
      ) : (
        <p className="item-meta">Откройте папку, чтобы увидеть вложенные объекты.</p>
      )}
    </Link>
  );
}
