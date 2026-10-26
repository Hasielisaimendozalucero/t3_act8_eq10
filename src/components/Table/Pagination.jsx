import { PAGE_SIZE_OPTIONS } from '../../constants/appConstants';
import './Table.css';

export default function Pagination({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Mostrando {firstItem}–{lastItem} de {totalItems}
        <label className="page-size">
          Registros por página:
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="pagination-controls">
        <button type="button" onClick={() => onPageChange(1)} disabled={currentPage <= 1}>«</button>
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>Anterior</button>
        <span className="page-indicator">Página {currentPage} de {totalPages}</span>
        <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Siguiente</button>
        <button type="button" onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages}>»</button>
      </div>
    </div>
  );
}
