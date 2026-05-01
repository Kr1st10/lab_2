const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export type TextFileChange = {
  id: number;
  fileId: number;
  fileName: string;
  newContent: string;
  changedAt: string;
};

export async function getTextFileChanges(token: string): Promise<TextFileChange[]> {
  const response = await fetch(`${API_URL}/admin/text-file-changes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    throw new Error("Необходимо войти как администратор");
  }

  if (!response.ok) {
    throw new Error("Не удалось загрузить данные админ-панели");
  }

  return (await response.json()) as TextFileChange[];
}
