type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="field-group">
      <span className="field-label">Поиск по имени</span>
      <input
        className="text-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Введите название файла или папки"
      />
    </label>
  );
}

