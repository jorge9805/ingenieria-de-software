// Componente reutilizable para filtros de búsqueda de experiencias

const SearchFilters = ({ 
  searchFilters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters,
  showTitle = true,
  showDescription = true,
  layout = 'horizontal' // 'horizontal' o 'vertical'
}) => {
  const isHorizontal = layout === 'horizontal';

  const containerStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '40px',
    border: '1px solid #e2e8f0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isHorizontal 
      ? 'repeat(auto-fit, minmax(250px, 1fr))' 
      : '1fr',
    gap: isHorizontal ? '20px' : '16px',
    alignItems: 'end'
  };

  const selectStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#03222b'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '2px solid #03222b',
    backgroundColor: 'transparent',
    color: '#03222b',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <div style={containerStyle}>
      {showTitle && (
        <h2 style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#03222b',
          textAlign: 'center'
        }}>
          🔍 Explora Nuestras Experiencias
        </h2>
      )}
      
      {showDescription && (
        <p style={{ 
          color: '#666',
          maxWidth: '512px',
          margin: '0 auto 30px auto',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          Encuentra la experiencia perfecta para ti. Filtra por tipo, región y presupuesto.
        </p>
      )}

      <div style={gridStyle}>
        {/* Filtro por Tipo */}
        <div>
          <label style={labelStyle}>
            🎯 Tipo de Experiencia
          </label>
          <select
            value={searchFilters.tipo}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#03222b'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="all">Todos los tipos</option>
            {filterOptions.tipos.map((tipo) => (
              <option key={tipo.tipo} value={tipo.tipo}>
                {tipo.tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Región */}
        <div>
          <label style={labelStyle}>
            📍 Región
          </label>
          <select
            value={searchFilters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#03222b'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="all">Todas las regiones</option>
            {filterOptions.regiones.map((region) => (
              <option key={region.region} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Rango de Precio */}
        <div>
          <label style={labelStyle}>
            💰 Rango de Precio
          </label>
          <select
            value={searchFilters.priceRange}
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#03222b'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="all">Todos los precios</option>
            {filterOptions.priceRanges.map((range, index) => (
              <option key={index} value={`${range.min}-${range.max}`}>
                {range.label}: {range.displayMin} - {range.displayMax}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        <div>
          <button
            onClick={onClearFilters}
            style={buttonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#03222b';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#03222b';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🔄 Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
