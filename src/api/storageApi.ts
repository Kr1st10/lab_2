import type { FileFilter, FileItem, FolderItem, StorageItem } from "../types/storage";

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

type ItemsQuery = {
  search?: string;
  type?: FileFilter;
};

function createQueryString(query: ItemsQuery = {}): string {
  const params = new URLSearchParams();
  const search = query.search?.trim() ?? "";
  const type = query.type ?? "all";

  if (search !== "") {
    params.set("search", search);
  }

  if (type !== "all") {
    params.set("type", type);
  }

  const queryString = params.toString();

  return queryString === "" ? "" : `?${queryString}`;
}

export async function getItems(query?: ItemsQuery): Promise<StorageItem[]> {
  return request<StorageItem[]>(`/storage/items${createQueryString(query)}`);
}

export async function getFolderById(id: number): Promise<FolderItem> {
  return request<FolderItem>(`/storage/folders/${id}`);
}

export async function getFolderContents(folderId: number, query?: ItemsQuery): Promise<StorageItem[]> {
  return request<StorageItem[]>(`/storage/folders/${folderId}/items${createQueryString(query)}`);
}

export async function getFileById(id: number): Promise<FileItem> {
  return request<FileItem>(`/storage/files/${id}`);
}

export async function updateTextFileContent(id: number, content: string): Promise<FileItem> {
  return request<FileItem>(`/storage/files/${id}/content`, {
    method: "PATCH",
    body: JSON.stringify({
      content
    })
  });
}
