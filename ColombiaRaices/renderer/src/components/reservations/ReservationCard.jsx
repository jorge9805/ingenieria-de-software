// ReservationCard.jsx
// Card para mostrar información de una reserva

import { COLORS } from '../../constants/colors';

const ReservationCard = ({ 
  reservation, 
  onViewDetails = null, 
  onConfirm = null, 
  onCancel = null,
  showActions = true 
}) => {
  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  // Función para obtener el ícono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'cancelled': return '❌';
      case 'completed': return '🎉';
      default: return '❓';
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e9ecef',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  };

  const statusStyle = {
    backgroundColor: getStatusColor(reservation.status),
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '8px',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: COLORS.primary,
    color: 'white'
  };

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  return (
    <div 
      style={cardStyle}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Header con título y estado */}
      <div style={headerStyle}>
        <div>
          <h3 style={{ 
            color: COLORS.primary, 
            margin: '0 0 5px 0',
            fontSize: '1.3rem'
          }}>
            {reservation.experience?.nombre || 'Experiencia'}
          </h3>
          <p style={{ 
            color: '#666', 
            margin: '0',
            fontSize: '0.9rem'
          }}>
            📍 {reservation.experience?.ubicacion || 'Ubicación no disponible'}
          </p>
        </div>
        <div style={statusStyle}>
          {getStatusIcon(reservation.status)} {getStatusText(reservation.status)}
        </div>
      </div>

      {/* Información principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <div>
          <strong style={{ color: '#333' }}>📅 Fecha:</strong>
          <br />
          <span style={{ color: '#666' }}>
            {formatDate(reservation.fecha_inicio)}
          </span>
        </div>
        
        <div>
          <strong style={{ color: '#333' }}>👥 Personas:</strong>
          <br />
          <span style={{ color: '#666' }}>
            {reservation.num_personas} {reservation.num_personas === 1 ? 'persona' : 'personas'}
          </span>
        </div>
        
        <div>
          <strong style={{ color: '#333' }}>💰 Total:</strong>
          <br />
          <span style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: '1.1rem' }}>
            {reservation.precio_total ? formatPrice(reservation.precio_total) : 'Por confirmar'}
          </span>
        </div>
        
        <div>
          <strong style={{ color: '#333' }}>📝 Reserva #:</strong>
          <br />
          <span style={{ color: '#666', fontFamily: 'monospace' }}>
            {reservation.id || 'N/A'}
          </span>
        </div>
      </div>

      {/* Servicios adicionales */}
      {reservation.servicios_adicionales && reservation.servicios_adicionales.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#333' }}>🎯 Servicios adicionales:</strong>
          <div style={{ marginTop: '5px' }}>
            {reservation.servicios_adicionales.map((servicio, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  marginRight: '5px',
                  marginBottom: '5px',
                  display: 'inline-block'
                }}
              >
                {servicio}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comentarios si existen */}
      {reservation.comentarios && (
        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#333' }}>💬 Comentarios:</strong>
          <p style={{ 
            color: '#666', 
            margin: '5px 0 0 0',
            fontStyle: 'italic',
            fontSize: '0.9rem'
          }}>
            "{reservation.comentarios}"
          </p>
        </div>
      )}

      {/* Fechas importantes */}
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#999',
        borderTop: '1px solid #e9ecef',
        paddingTop: '10px',
        marginBottom: showActions ? '15px' : '0'
      }}>
        <span>Creada: {formatDate(reservation.created_at)}</span>
        {reservation.updated_at && reservation.updated_at !== reservation.created_at && (
          <span style={{ marginLeft: '15px' }}>
            Actualizada: {formatDate(reservation.updated_at)}
          </span>
        )}
      </div>

      {/* Botones de acción */}
      {showActions && (
        <div style={{ textAlign: 'right' }}>
          {onViewDetails && (
            <button
              style={secondaryButtonStyle}
              onClick={() => onViewDetails(reservation)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              👁️ Ver Detalles
            </button>
          )}
          
          {reservation.status === 'pending' && onConfirm && (
            <button
              style={successButtonStyle}
              onClick={() => onConfirm(reservation.id)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              ✅ Confirmar
            </button>
          )}
          
          {(reservation.status === 'pending' || reservation.status === 'confirmed') && onCancel && (
            <button
              style={dangerButtonStyle}
              onClick={() => onCancel(reservation.id)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
