import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TravelerHeader from '../../components/traveler/TravelerHeader';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingExperiences: 0,
    totalExperiences: 0,
    activeOperators: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      // TODO: Implementar llamadas a API para estadísticas
      // Por ahora usamos datos mock
      setStats({
        pendingExperiences: 5,
        totalExperiences: 23,
        activeOperators: 8,
        totalUsers: 45
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
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
            <p>Cargando dashboard...</p>
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
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ 
            color: '#03222b', 
            marginBottom: '15px', 
            fontSize: '2.5rem' 
          }}>
            🛡️ Panel de Administración
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.2rem' 
          }}>
            Gestiona experiencias, operadores y contenido de la plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏳</div>
            <h3 style={{ color: '#03222b', marginBottom: '5px' }}>
              {stats.pendingExperiences}
            </h3>
            <p style={{ color: '#666', margin: 0 }}>Experiencias Pendientes</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
            <h3 style={{ color: '#03222b', marginBottom: '5px' }}>
              {stats.totalExperiences}
            </h3>
            <p style={{ color: '#666', margin: 0 }}>Total Experiencias</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👥</div>
            <h3 style={{ color: '#03222b', marginBottom: '5px' }}>
              {stats.activeOperators}
            </h3>
            <p style={{ color: '#666', margin: 0 }}>Operadores Activos</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
            <h3 style={{ color: '#03222b', marginBottom: '5px' }}>
              {stats.totalUsers}
            </h3>
            <p style={{ color: '#666', margin: 0 }}>Usuarios Registrados</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          <button
            onClick={() => navigate(ROUTES.APPROVE_EXPERIENCES)}
            style={{
              backgroundColor: '#fbd338',
              color: '#03222b',
              border: 'none',
              padding: '25px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f2c832';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fbd338';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ✅ Aprobar Experiencias
            {stats.pendingExperiences > 0 && (
              <span style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                marginLeft: '5px'
              }}>
                {stats.pendingExperiences}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              alert('🚧 Funcionalidad en desarrollo\n\nEsta sección permitirá gestionar operadores en futuras versiones.');
            }}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '25px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#138496';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#17a2b8';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            👥 Gestionar Operadores
          </button>

          <button
            onClick={() => {
              alert('🚧 Funcionalidad en desarrollo\n\nEsta sección permitirá ver reportes y estadísticas detalladas.');
            }}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '25px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#218838';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📊 Ver Reportes
          </button>

          <button
            onClick={() => {
              alert('🚧 Funcionalidad en desarrollo\n\nEsta sección permitirá gestionar contenido y configuraciones.');
            }}
            style={{
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              padding: '25px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#5a32a3';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6f42c1';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ⚙️ Configuración
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          marginTop: '40px', 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: '#03222b', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ⚡ Acciones Rápidas
          </h3>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            flexWrap: 'wrap' 
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#f8f9fa',
                color: '#03222b',
                border: '1px solid #dee2e6',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e6ea';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            >
              🏠 Ir al Inicio
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#f8f9fa',
                color: '#03222b',
                border: '1px solid #dee2e6',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e6ea';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            >
              🔄 Refrescar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
