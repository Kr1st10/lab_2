import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllItems, getFolderById, getFolderContents } from "../api/storageApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { FileTypeFilter } from "../components/FileTypeFilter";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { SearchBar } from "../components/SearchBar";
import {
  getFileFilterCategory,
  isFileItem,
  type FileFilter,
  type FolderItem,
  type StorageItem
} from "../types/storage";

function sortItems(items: StorageItem[]) {
  return [...items].sort((left, right) => {
    if (left.kind !== right.kind) {
      return left.kind === "folder" ? -1 : 1;
    }

    return left.name.localeCompare(right.name, "ru");
  });
}

function filterItems(items: StorageItem[], searchValue: string, selectedType: FileFilter) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return items.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(normalizedSearch);
    const matchesType =
      selectedType === "all" ? true : isFileItem(item) && getFileFilterCategory(item.fileType) === selectedType;

    return matchesName && matchesType;
  });
}

export function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const folderId = Number(id);
  const [folder, setFolder] = useState<FolderItem | null>(null);
  const [items, setItems] = useState<StorageItem[]>([]);
  const [allItems, setAllItems] = useState<StorageItem[]>([]);
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
      const [folderResponse, itemsResponse, allItemsResponse] = await Promise.all([
        getFolderById(folderId),
        getFolderContents(folderId),
        getAllItems()
      ]);
      setFolder(folderResponse);
      setItems(sortItems(itemsResponse));
      setAllItems(sortItems(allItemsResponse));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadFolderData();
  }, [folderId]);

  const isGlobalSearch = searchValue.trim() !== "" || selectedType !== "all";
  const visibleItems = isGlobalSearch
    ? filterItems(allItems, searchValue, selectedType)
    : filterItems(items, searchValue, selectedType);

  return (
    <section className="page-card">
      <div className="page-intro">
        <div>
          <h1>{folder?.name ?? "Страница папки"}</h1>
          <p>
            {isGlobalSearch
              ? "Показаны результаты поиска по всему хранилищу."
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
            {isGlobalSearch ? (
              <p>
                <strong>Найдено по всему хранилищу:</strong> {visibleItems.length}
              </p>
            ) : null}
          </section>

          <div className="toolbar">
            <SearchBar value={searchValue} onChange={setSearchValue} />
            <FileTypeFilter value={selectedType} onChange={setSelectedType} />
          </div>

          <ItemList items={visibleItems} emptyMessage="В этой папке ничего не найдено" />
        </>
      ) : null}
    </section>
  );
}
