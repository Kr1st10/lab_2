import { useEffect, useState } from "react";
import { getAllItems } from "../api/storageApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { FileTypeFilter } from "../components/FileTypeFilter";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { SearchBar } from "../components/SearchBar";
import {
  getFileFilterCategory,
  isFileItem,
  type FileFilter,
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

export function HomePage() {
  const [allItems, setAllItems] = useState<StorageItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState<FileFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllItems();
      setAllItems(sortItems(response));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  const rootItems = allItems.filter((item) => item.folderId == null);
  const isGlobalSearch = searchValue.trim() !== "" || selectedType !== "all";
  const visibleItems = isGlobalSearch
    ? filterItems(allItems, searchValue, selectedType)
    : rootItems;

  return (
    <section className="page-card">
      <div className="page-intro">
        <div>
          <h1>Корневая папка</h1>
          <p>
            {isGlobalSearch
              ? "Показаны результаты поиска по всему хранилищу."
              : "На этой странице показаны файлы и папки верхнего уровня."}
          </p>
        </div>
        <div className="page-note">
          {isGlobalSearch ? `Найдено: ${visibleItems.length}` : `Всего объектов: ${rootItems.length}`}
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={searchValue} onChange={setSearchValue} />
        <FileTypeFilter value={selectedType} onChange={setSelectedType} />
      </div>

      {isLoading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={() => void loadItems()} /> : null}
      {!isLoading && !error ? <ItemList items={visibleItems} /> : null}
    </section>
  );
}
