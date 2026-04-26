import type { FileItem, FolderItem, StorageItem } from "../types/storage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить данные");
  }

  return (await response.json()) as T;
}

async function getFolders(): Promise<FolderItem[]> {
  return request<FolderItem[]>("/folders");
}

async function getFiles(): Promise<FileItem[]> {
  return request<FileItem[]>("/files");
}

export async function getAllItems(): Promise<StorageItem[]> {
  const [folders, files] = await Promise.all([getFolders(), getFiles()]);

  return [...folders, ...files];
}

export async function getRootItems(): Promise<StorageItem[]> {
  const items = await getAllItems();

  return items.filter((item) => item.folderId == null);
}

export async function getFolderById(id: number): Promise<FolderItem> {
  return request<FolderItem>(`/folders/${id}`);
}

export async function getFolderContents(folderId: number): Promise<StorageItem[]> {
  const [folders, files] = await Promise.all([getFolders(), getFiles()]);

  return [...folders.filter((folder) => folder.folderId === folderId), ...files.filter((file) => file.folderId === folderId)];
}

export async function getFileById(id: number): Promise<FileItem> {
  return request<FileItem>(`/files/${id}`);
}

export async function updateTextFileContent(id: number, content: string): Promise<FileItem> {
  const updatedAt = new Date().toISOString();
  const size = new TextEncoder().encode(content).length;

  return request<FileItem>(`/files/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      content,
      updatedAt,
      size
    })
  });
}
