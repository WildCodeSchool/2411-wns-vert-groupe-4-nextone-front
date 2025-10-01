type ItemsPerPageSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function ItemsPerPageSelector({ value, onChange }: ItemsPerPageSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="itemsPerPage" className="text-gray-700 whitespace-nowrap">
        Afficher :
      </label>
      <select
        id="itemsPerPage"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>
      <span className="text-gray-500">tickets par page</span>
    </div>
  );
}
