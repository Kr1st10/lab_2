export type FileType =
  | "text"
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "other";

export type FileFilter = "all" | "image" | "video" | "music" | "document" | "other";

export type FileItem = {
  id: number;
  name: string;
  kind: "file";
  fileType: FileType;
  extension: string;
  size: number;
  path: string;
  updatedAt: string;
  content?: string;
  url?: string;
  folderId?: number | null;
};

export type FolderItem = {
  id: number;
  name: string;
  kind: "folder";
  path: string;
  folderId?: number | null;
};

export type StorageItem = FileItem | FolderItem;

export function isFileItem(item: StorageItem): item is FileItem {
  return item.kind === "file";
}

export function getFileFilterCategory(fileType: FileType): Exclude<FileFilter, "all"> {
  switch (fileType) {
    case "image":
      return "image";
    case "video":
      return "video";
    case "audio":
      return "music";
    case "text":
    case "pdf":
    case "document":
      return "document";
    default:
      return "other";
  }
}

export function getFileTypeLabel(fileType: FileType): string {
  switch (fileType) {
    case "text":
      return "Текстовый файл";
    case "pdf":
      return "PDF-файл";
    case "image":
      return "Изображение";
    case "video":
      return "Видео";
    case "audio":
      return "Аудио";
    case "document":
      return "Документ";
    default:
      return "Прочий файл";
  }
}

export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} Б`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} КБ`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString("ru-RU");
}

