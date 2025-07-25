// Componente de filtros para búsqueda de comunidades
import { REGIONS } from '../../utils/constants';

const CommunitySearchFilters = ({ 
  searchFilters, 
  onFilterChange, 
  onClearFilters,
  showTitle = true,
  showDescription = true,
  layout = 'horizontal'
}) => {
  
  const filterContainerStyle = {
    backgroundColor: 'white',
    padding: '32px 20px',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };
  const gridStyle = layout === 'horizontal' ? {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 280px))',
    gap: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'end',
    justifyContent: 'center'
  } : {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '300px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.9rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.2s',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  const buttonStyle = {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    height: 'fit-content'
  };

  return (
    <div style={filterContainerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {showTitle && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#03222b',
              margin: '0 0 8px 0'
            }}>
              🔍 Buscar Comunidades
            </h2>
            {showDescription && (
              <p style={{ 
                color: '#666', 
                fontSize: '0.95rem',
                margin: 0
              }}>
                Encuentra comunidades colombianas por nombre o región
              </p>
            )}
          </div>
        )}

        <div style={gridStyle}>
          {/* Filtro por nombre */}
          <div>
            <label style={labelStyle}>
              🏘️ Nombre de Comunidad
            </label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Buscar por nombre..."
              value={searchFilters.nombre || ''}
              onChange={(e) => onFilterChange('nombre', e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>

          {/* Filtro por región */}
          <div>
            <label style={labelStyle}>
              📍 Región
            </label>
            <select
              style={inputStyle}
              value={searchFilters.region || 'all'}
              onChange={(e) => onFilterChange('region', e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            >
              <option value="all">Todas las regiones</option>
              {Object.values(REGIONS).map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div>
            <button
              style={buttonStyle}
              onClick={onClearFilters}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#10b981';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔄 Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Indicador de filtros activos */}
        {(searchFilters.nombre || (searchFilters.region && searchFilters.region !== 'all')) && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#fef3cd',
            borderRadius: '6px',
            border: '1px solid #fbbf24',
            textAlign: 'center'
          }}>
            <span style={{ 
              fontSize: '0.85rem', 
              color: '#92400e',
              fontWeight: '500'
            }}>
              🔍 Filtros activos: 
              {searchFilters.nombre && ` Nombre: "${searchFilters.nombre}"`}
              {searchFilters.region && searchFilters.region !== 'all' && ` • Región: ${searchFilters.region}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySearchFilters;
