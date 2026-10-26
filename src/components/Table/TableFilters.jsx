import './Table.css';

export default function TableFilters({ searchText, selectedCategory, categoryOptions, categoryLabel, onSearchChange, onCategoryChange }) {
  return (
    <div className="table-filters">
      <input
        type="search"
        className="filter-input"
        placeholder="Buscar por nombre..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select className="filter-select" value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">{categoryLabel}: todos</option>
        {categoryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
