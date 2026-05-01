import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFolderById, getFolderContents } from "../api/storageApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { FileTypeFilter } from "../components/FileTypeFilter";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { SearchBar } from "../components/SearchBar";
import { type FileFilter, type FolderItem, type StorageItem } from "../types/storage";

export function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const folderId = Number(id);
  const [folder, setFolder] = useState<FolderItem | null>(null);
  const [items, setItems] = useState<StorageItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState<FileFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadFolderData() {
    if (Number.isNaN(folderId)) {
      setError("Папка не найдена");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [folderResponse, itemsResponse] = await Promise.all([
        getFolderById(folderId),
        getFolderContents(folderId, {
          search: searchValue,
          type: selectedType
        })
      ]);
      setFolder(folderResponse);
      setItems(itemsResponse);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadFolderData();
  }, [folderId, searchValue, selectedType]);

  const isSearchOrFilterActive = searchValue.trim() !== "" || selectedType !== "all";

  return (
    <section className="page-card">
      <div className="page-intro">
        <div>
          <h1>{folder?.name ?? "Страница папки"}</h1>
          <p>
            {isSearchOrFilterActive
              ? "Показаны результаты поиска внутри этой папки."
              : "Подробная информация о папке и список вложенных объектов."}
          </p>
        </div>
        <div className="actions-row">
          <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
            Назад
          </button>
          <Link to="/" className="header-link">
            В корень
          </Link>
        </div>
      </div>

      {isLoading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={() => void loadFolderData()} /> : null}

      {!isLoading && !error && folder ? (
        <>
          <section className="details-card">
            <h2>Информация о папке</h2>
            <p>
              <strong>ID:</strong> {folder.id}
            </p>
            <p>
              <strong>Название:</strong> {folder.name}
            </p>
            <p>
              <strong>Путь:</strong> {folder.path}
            </p>
            <p>
              <strong>Количество вложенных объектов:</strong> {items.length}
            </p>
            {isSearchOrFilterActive ? (
              <p>
                <strong>Найдено в папке:</strong> {items.length}
              </p>
            ) : null}
          </section>

          <div className="toolbar">
            <SearchBar value={searchValue} onChange={setSearchValue} />
            <FileTypeFilter value={selectedType} onChange={setSelectedType} />
          </div>

          <ItemList items={items} emptyMessage="В этой папке ничего не найдено" />
        </>
      ) : null}
    </section>
  );
}
