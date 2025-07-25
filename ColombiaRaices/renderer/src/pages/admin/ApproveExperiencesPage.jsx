import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TravelerHeader from '../../components/traveler/TravelerHeader';
import { ROUTES } from '../../utils/constants';
import useApproval from '../../hooks/useApproval';
import { 
  formatApprovalStatus, 
  generateApprovalStats, 
  extractExperienceSummary 
} from '../../utils/approval';

const ApproveExperiencesPage = () => {
  const navigate = useNavigate();
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Hook personalizado para aprobaciones
  const { 
    approveExperience, 
    rejectExperience, 
    isProcessing, 
    validateAdminPermissions 
  } = useApproval();

  useEffect(() => {
    // Verificar permisos al cargar
    if (!validateAdminPermissions()) {
      setError('No tienes permisos de administrador para acceder a esta página');
      return;
    }
    
    loadPendingExperiences();
  }, []);  const loadPendingExperiences = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        // Usar la nueva API dedicada para obtener experiencias pendientes
        const result = await window.electronAPI.experiences.getPending();
        
        if (result.success) {
          const experiences = result.experiences || [];
          setPendingExperiences(experiences);
          
          // Generar estadísticas
          const approvalStats = generateApprovalStats(experiences);
          setStats(approvalStats);
          
          console.log('Experiencias pendientes cargadas:', experiences.length);
        } else {
          throw new Error(result.error || 'Error al cargar experiencias pendientes');
        }
      } else {
        // Fallback para desarrollo
        console.warn('ElectronAPI no disponible, usando datos mock');
        setPendingExperiences([]);
        setStats(generateApprovalStats([]));
      }
    } catch (error) {
      console.error('Error cargando experiencias pendientes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (experience) => {
    const result = await approveExperience(experience, 
      // onSuccess
      () => {
        loadPendingExperiences(); // Recargar lista
      },
      // onError  
      (error) => {
        console.error('Error en aprobación:', error);
      }
    );
    
    return result;
  };

  const handleReject = async (experience) => {
    const result = await rejectExperience(experience,
      // onSuccess
      () => {
        loadPendingExperiences(); // Recargar lista
      },
      // onError
      (error) => {
        console.error('Error en rechazo:', error);
      }
    );
    
    return result;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <TravelerHeader />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '20px' 
            }}>⏳</div>
            <p>Cargando experiencias pendientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <TravelerHeader />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '20px',
                fontSize: '0.9rem'
              }}
            >
              ← Volver al Dashboard
            </button>
            
            <h1 style={{ 
              color: '#03222b', 
              margin: 0,
              fontSize: '2rem' 
            }}>
              ✅ Aprobar Experiencias
            </h1>
          </div>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '20px', 
            fontSize: '1.1rem' 
          }}>
            Revisa y aprueba las experiencias enviadas por los operadores
          </p>

          {/* Estadísticas de aprobación */}
          {stats && stats.total > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #b3d7ff'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0066cc' }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Experiencias Pendientes
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0369a1' }}>
                  ${stats.averagePrice?.toLocaleString()} COP
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Precio Promedio
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f0fdf4',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#059669' }}>
                  {Object.keys(stats.byType).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Tipos de Experiencia
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#fffbeb',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #fde68a'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d97706' }}>
                  {Object.keys(stats.byOperator).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Operadores Únicos
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              Error: {error}
              <button 
                onClick={loadPendingExperiences}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Reintentar
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {pendingExperiences.length === 0 ? (
          <div style={{
            backgroundColor: '#d1ecf1',
            color: '#0c5460',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #b6ebf3'
          }}>
            <h3 style={{ color: '#0c5460', marginBottom: '15px' }}>
              🎉 ¡Excelente trabajo!
            </h3>
            <p style={{ marginBottom: '20px' }}>
              No hay experiencias pendientes de aprobación en este momento.
            </p>
            <button
              onClick={loadPendingExperiences}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              🔄 Refrescar
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '5px'
            }}>
              <strong>📋 {pendingExperiences.length} experiencia(s) pendiente(s)</strong>
              <p style={{ margin: '5px 0 0', color: '#856404' }}>
                Revisa cuidadosamente cada experiencia antes de aprobar o rechazar.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px'
            }}>
              {pendingExperiences.map((experience) => (
                <div
                  key={experience.id}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #ffc107',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Header de la card */}
                  <div style={{
                    padding: '20px 20px 15px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff3cd'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <h3 style={{ 
                        color: '#03222b', 
                        margin: '0 10px 0 0',
                        fontSize: '1.2rem',
                        lineHeight: '1.3'
                      }}>
                        {experience.title}
                      </h3>
                      
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: '#ffc107',
                        color: '#212529'
                      }}>
                        PENDIENTE
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <strong>Tipo:</strong> {experience.type} | <strong>ID:</strong> {experience.id}
                    </div>
                  </div>

                  {/* Contenido de la experiencia */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>📝 Descripción:</strong>
                      <p style={{ 
                        margin: '5px 0 0', 
                        color: '#666', 
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        {experience.description}
                      </p>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>💰 Precio:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          ${experience.price?.toLocaleString()} COP
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>⏱️ Duración:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.duration} horas
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>👥 Max. personas:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.maxParticipants}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>🏘️ Comunidad:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.community?.name || 'No especificada'}
                        </p>
                      </div>
                    </div>

                    {experience.location && (
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>📍 Ubicación:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.location}
                        </p>
                      </div>
                    )}

                    {/* Información del operador */}
                    <div style={{ 
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      fontSize: '0.8rem',
                      color: '#666'
                    }}>
                      <strong>Operador ID:</strong> {experience.operatorId} | 
                      <strong> Creada:</strong> {new Date(experience.createdAt).toLocaleDateString()}
                    </div>

                    {/* Botones de acción */}
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>                      <button
                        onClick={() => handleApprove(experience)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: isProcessing ? '#6c757d' : '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: isProcessing ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isProcessing) {
                            e.target.style.backgroundColor = '#218838';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isProcessing) {
                            e.target.style.backgroundColor = '#28a745';
                          }
                        }}
                      >
                        {isProcessing ? '⏳ Procesando...' : '✅ Aprobar'}
                      </button>
                      
                      <button
                        onClick={() => handleReject(experience)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: isProcessing ? '#6c757d' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: isProcessing ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isProcessing) {
                            e.target.style.backgroundColor = '#c82333';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isProcessing) {
                            e.target.style.backgroundColor = '#dc3545';
                          }
                        }}
                      >
                        {isProcessing ? '⏳ Procesando...' : '❌ Rechazar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApproveExperiencesPage;
