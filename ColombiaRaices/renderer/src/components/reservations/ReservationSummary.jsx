// ReservationSummary.jsx
// Componente para mostrar resumen de reserva

import { COLORS } from '../../constants/colors';

const ReservationSummary = ({ 
  reservationData, 
  estimateData = null,
  showEstimate = true,
  showActions = true,
  onConfirm = null,
  onEdit = null,
  loading = false
}) => {
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e9ecef',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f8f9fa'
  };

  const sectionStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: '5px',
    fontSize: '0.9rem'
  };

  const valueStyle = {
    color: '#212529',
    fontSize: '1rem',
    marginBottom: '10px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '10px',
    transition: 'all 0.3s ease',
    disabled: loading
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={{ 
          color: COLORS.primary, 
          margin: '0 0 10px 0',
          fontSize: '1.8rem'
        }}>
          📋 Resumen de Reserva
        </h2>
        <p style={{ 
          color: '#6c757d', 
          margin: 0,
          fontSize: '1rem'
        }}>
          Revisa los detalles antes de confirmar
        </p>
      </div>

      {/* Información de la experiencia */}
      <div style={sectionStyle}>
        <h3 style={{ 
          color: COLORS.primary, 
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🌟 Experiencia Seleccionada
        </h3>
        
        <div style={labelStyle}>Nombre:</div>
        <div style={valueStyle}>
          {reservationData.experience?.nombre || 'Experiencia no especificada'}
        </div>
        
        <div style={labelStyle}>Ubicación:</div>
        <div style={valueStyle}>
          📍 {reservationData.experience?.ubicacion || 'Ubicación no disponible'}
        </div>
        
        {reservationData.experience?.descripcion && (
          <>
            <div style={labelStyle}>Descripción:</div>
            <div style={{...valueStyle, fontSize: '0.9rem', color: '#6c757d'}}>
              {reservationData.experience.descripcion}
            </div>
          </>
        )}
      </div>

      {/* Detalles de la reserva */}
      <div style={sectionStyle}>
        <h3 style={{ 
          color: COLORS.primary, 
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📅 Detalles de la Reserva
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <div style={labelStyle}>Fecha de inicio:</div>
            <div style={valueStyle}>
              {formatDate(reservationData.fecha_inicio)}
            </div>
          </div>
          
          <div>
            <div style={labelStyle}>Número de personas:</div>
            <div style={valueStyle}>
              👥 {reservationData.num_personas} {reservationData.num_personas === 1 ? 'persona' : 'personas'}
            </div>
          </div>
        </div>
      </div>

      {/* Servicios adicionales */}
      {reservationData.servicios_adicionales && reservationData.servicios_adicionales.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={{ 
            color: COLORS.primary, 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 Servicios Adicionales
          </h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {reservationData.servicios_adicionales.map((servicio, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}
              >
                ✓ {servicio}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contacto de emergencia */}
      {(reservationData.contacto_emergencia || reservationData.telefono_emergencia) && (
        <div style={sectionStyle}>
          <h3 style={{ 
            color: COLORS.primary, 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🚨 Contacto de Emergencia
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {reservationData.contacto_emergencia && (
              <div>
                <div style={labelStyle}>Nombre:</div>
                <div style={valueStyle}>{reservationData.contacto_emergencia}</div>
              </div>
            )}
            
            {reservationData.telefono_emergencia && (
              <div>
                <div style={labelStyle}>Teléfono:</div>
                <div style={valueStyle}>📞 {reservationData.telefono_emergencia}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comentarios */}
      {reservationData.comentarios && (
        <div style={sectionStyle}>
          <h3 style={{ 
            color: COLORS.primary, 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💬 Comentarios Adicionales
          </h3>
          
          <div style={{
            ...valueStyle,
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
            fontStyle: 'italic'
          }}>
            "{reservationData.comentarios}"
          </div>
        </div>
      )}

      {/* Estimación de costos */}
      {showEstimate && estimateData && (
        <div style={{
          ...sectionStyle,
          backgroundColor: '#e8f5e8',
          border: '2px solid #28a745'
        }}>
          <h3 style={{ 
            color: '#28a745', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💰 Estimación de Costos
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
            <div style={labelStyle}>Costo base de la experiencia:</div>
            <div style={{ ...valueStyle, textAlign: 'right', fontWeight: 'bold' }}>
              {formatPrice(estimateData.precio_base || 0)}
            </div>
            
            <div style={labelStyle}>Servicios adicionales:</div>
            <div style={{ ...valueStyle, textAlign: 'right', fontWeight: 'bold' }}>
              {formatPrice(estimateData.servicios_adicionales || 0)}
            </div>
            
            <div style={{ 
              ...labelStyle, 
              fontSize: '1.1rem', 
              color: '#28a745',
              paddingTop: '10px',
              borderTop: '2px solid #28a745'
            }}>
              Total estimado:
            </div>
            <div style={{ 
              ...valueStyle, 
              textAlign: 'right', 
              fontSize: '1.3rem', 
              fontWeight: 'bold',
              color: '#28a745',
              paddingTop: '10px',
              borderTop: '2px solid #28a745'
            }}>
              {formatPrice(estimateData.total || 0)}
            </div>
          </div>
          
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#d4edda',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#155724'
          }}>
            <strong>Nota:</strong> Este es un costo estimado. El precio final puede variar según disponibilidad y condiciones específicas.
          </div>
        </div>
      )}

      {/* Botones de acción */}
      {showActions && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '2px solid #f8f9fa'
        }}>
          {onEdit && (
            <button
              style={{
                ...buttonStyle,
                backgroundColor: '#6c757d',
                color: 'white'
              }}
              onClick={onEdit}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a6268')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#6c757d')}
            >
              ✏️ Editar
            </button>
          )}
          
          {onConfirm && (
            <button
              style={{
                ...buttonStyle,
                backgroundColor: COLORS.primary,
                color: 'white'
              }}
              onClick={() => onConfirm(reservationData)}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f2c832')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = COLORS.primary)}
            >
              {loading ? '⏳ Procesando...' : '✅ Confirmar Reserva'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationSummary;
