import { useEffect, useState } from "react";
import { getItems } from "../api/storageApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { FileTypeFilter } from "../components/FileTypeFilter";
import { ItemList } from "../components/ItemList";
import { Loader } from "../components/Loader";
import { SearchBar } from "../components/SearchBar";
import { type FileFilter, type StorageItem } from "../types/storage";

export function HomePage() {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState<FileFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getItems({
        search: searchValue,
        type: selectedType
      });
      setItems(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить данные");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, [searchValue, selectedType]);

  const isGlobalSearch = searchValue.trim() !== "" || selectedType !== "all";

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
          {isGlobalSearch ? `Найдено: ${items.length}` : `Всего объектов: ${items.length}`}
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={searchValue} onChange={setSearchValue} />
        <FileTypeFilter value={selectedType} onChange={setSelectedType} />
      </div>

      {isLoading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={() => void loadItems()} /> : null}
      {!isLoading && !error ? <ItemList items={items} /> : null}
    </section>
  );
}
