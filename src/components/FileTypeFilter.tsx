import type { FileFilter } from "../types/storage";

type FileTypeFilterProps = {
  value: FileFilter;
  onChange: (value: FileFilter) => void;
};

const options: Array<{ value: FileFilter; label: string }> = [
  { value: "all", label: "Все объекты" },
  { value: "image", label: "Изображения" },
  { value: "video", label: "Видео" },
  { value: "music", label: "Музыка" },
  { value: "document", label: "Документы" },
  { value: "other", label: "Прочие" }
];

export function FileTypeFilter({ value, onChange }: FileTypeFilterProps) {
  return (
    <label className="field-group">
      <span className="field-label">Фильтр по виду файла</span>
      <select className="select-input" value={value} onChange={(event) => onChange(event.target.value as FileFilter)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

