import React from 'react';
import { COLORS } from '../../constants/colors';

class ReservationErrorBoundary extends React.Component {  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
    
    // Bind methods
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Registrar error para debugging
    console.error('🚨 Reservation Error Boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // En producción, aquí enviarías el error a un servicio de logging
    // Analytics.trackError('ReservationComponent', error);
  }

  handleRetry() {
    if (this.state.retryCount < 3) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1
      });
    } else {
      // Después de 3 intentos, sugerir recargar la página
      if (window.confirm('Ha ocurrido un error persistente. ¿Deseas recargar la página?')) {
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const { retryCount } = this.state;
      const canRetry = retryCount < 3;

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px',
          backgroundColor: '#fff5f5',
          border: '1px solid #fed7d7',
          borderRadius: '12px',
          margin: '20px'
        }}>
          {/* Ícono de error */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px'
          }}>
            🚨
          </div>

          {/* Título */}
          <h2 style={{
            color: '#c53030',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Error en el Sistema de Reservas
          </h2>

          {/* Descripción */}
          <p style={{
            color: '#666',
            textAlign: 'center',
            maxWidth: '500px',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            Ha ocurrido un error inesperado. Esto puede deberse a un problema temporal 
            de conexión o datos inválidos. Puedes intentar nuevamente.
          </p>

          {/* Detalles técnicos (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              backgroundColor: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              maxWidth: '600px',
              width: '100%'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Detalles técnicos (desarrollo)
              </summary>
              <pre style={{
                fontSize: '12px',
                color: '#2d3748',
                marginTop: '12px',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          {/* Botones de acción */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {canRetry ? (
              <button
                onClick={this.handleRetry}
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
                onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
              >
                🔄 Intentar Nuevamente {retryCount > 0 && `(${3 - retryCount} restantes)`}
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                🔄 Recargar Página
              </button>
            )}

            <button
              onClick={() => window.history.back()}
              style={{
                backgroundColor: 'transparent',
                color: COLORS.primary,
                border: `2px solid ${COLORS.primary}`,
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = COLORS.primary;
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = COLORS.primary;
              }}
            >
              ← Volver
            </button>
          </div>

          {/* Información adicional */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f7fafc',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>
              Si el problema persiste, contacta al soporte técnico.
            </p>
          </div>
        </div>
      );
    }

    // Si no hay error, renderizar los children normalmente
    return this.props.children;
  }
}

export default ReservationErrorBoundary;
