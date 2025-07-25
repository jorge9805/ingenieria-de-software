// ReservationFilters.jsx
// Filtros para historial y búsqueda de reservas

import { COLORS } from '../../constants/colors';

const ReservationFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  showAdvanced = true 
}) => {
  
  const handleFilterChange = (field, value) => {
    onFiltersChange({ [field]: value });
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  };

  const filterRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.9rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease'
  };

  const buttonStyle = {
    backgroundColor: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const clearButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    marginLeft: '10px'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ 
        color: COLORS.primary, 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🔍 Filtros de Búsqueda
      </h3>

      {/* Filtros básicos */}
      <div style={filterRowStyle}>
        {/* Estado de reserva */}
        <div>
          <label style={labelStyle}>Estado</label>
          <select
            style={inputStyle}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">⏳ Pendientes</option>
            <option value="confirmed">✅ Confirmadas</option>
            <option value="cancelled">❌ Canceladas</option>
            <option value="completed">🎉 Completadas</option>
          </select>
        </div>

        {/* Tipo de experiencia */}
        <div>
          <label style={labelStyle}>Tipo de Experiencia</label>
          <select
            style={inputStyle}
            value={filters.experienceType}
            onChange={(e) => handleFilterChange('experienceType', e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            <option value="cultural">🏺 Cultural</option>
            <option value="historica">🏛️ Histórica</option>
            <option value="ecologica">🌿 Ecológica</option>
            <option value="aventura">🏔️ Aventura</option>
            <option value="gastronomica">🍽️ Gastronómica</option>
            <option value="artesanal">🎨 Artesanal</option>
          </select>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div style={filterRowStyle}>
          {/* Fecha desde */}
          <div>
            <label style={labelStyle}>Fecha desde</label>
            <input
              type="date"
              style={inputStyle}
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label style={labelStyle}>Fecha hasta</label>
            <input
              type="date"
              style={inputStyle}
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              min={filters.dateFrom || ''}
            />
          </div>
        </div>
      )}

      {/* Información de filtros activos */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#6c757d',
        marginBottom: '15px'
      }}>
        <span style={{ fontWeight: 'bold' }}>Filtros activos:</span>
        {filters.status !== 'all' && (
          <span style={{ marginLeft: '10px' }}>
            Estado: <strong>{filters.status}</strong>
          </span>
        )}
        {filters.experienceType !== 'all' && (
          <span style={{ marginLeft: '10px' }}>
            Tipo: <strong>{filters.experienceType}</strong>
          </span>
        )}
        {filters.dateFrom && (
          <span style={{ marginLeft: '10px' }}>
            Desde: <strong>{filters.dateFrom}</strong>
          </span>
        )}
        {filters.dateTo && (
          <span style={{ marginLeft: '10px' }}>
            Hasta: <strong>{filters.dateTo}</strong>
          </span>
        )}
        {filters.status === 'all' && 
         filters.experienceType === 'all' && 
         !filters.dateFrom && 
         !filters.dateTo && (
          <span style={{ marginLeft: '10px' }}>Ninguno aplicado</span>
        )}
      </div>

      {/* Botones de acción */}
      <div style={{ textAlign: 'right' }}>
        <button
          style={clearButtonStyle}
          onClick={onClearFilters}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          🗑️ Limpiar Filtros
        </button>
        
        <button
          style={buttonStyle}
          onClick={() => {
            // Trigger de aplicación de filtros (opcional, ya que se aplican automáticamente)
            console.log('Aplicando filtros:', filters);
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
          onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
        >
          🎯 Aplicar Filtros
        </button>
      </div>

      {/* Estadísticas rápidas (opcional) */}
      <div style={{
        borderTop: '1px solid #e9ecef',
        paddingTop: '15px',
        marginTop: '15px',
        fontSize: '0.85rem',
        color: '#6c757d'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span>💡 <strong>Tip:</strong> Usa los filtros para encontrar reservas específicas</span>
          <span>📊 Los filtros se aplican automáticamente</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilters;
