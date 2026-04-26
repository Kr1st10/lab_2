import type { StorageItem } from "../types/storage";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: StorageItem[];
  emptyMessage?: string;
};

export function ItemList({ items, emptyMessage = "Ничего не найдено" }: ItemListProps) {
  if (items.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <section className="item-grid">
      {items.map((item) => (
        <ItemCard key={`${item.kind}-${item.id}`} item={item} />
      ))}
    </section>
  );
}

