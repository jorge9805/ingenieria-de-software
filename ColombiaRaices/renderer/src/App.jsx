import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Importar páginas principales
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ExperiencesPage from './pages/ExperiencesPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ReservationsPage from './pages/ReservationsPage';
import UnderConstructionPage from './components/common/UnderConstructionPage';
import TravelerDashboard from './pages/traveler/TravelerDashboard';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import PublishExperiencePage from './pages/operator/PublishExperiencePage';
import ManageExperiencesPage from './pages/operator/ManageExperiencesPage';
import EditExperiencePage from './pages/operator/EditExperiencePage';
import OperatorReservationsPage from './pages/operator/OperatorReservationsPage';

// Importar páginas de admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ApproveExperiencesPage from './pages/admin/ApproveExperiencesPage';

// Importar páginas de reservas directamente (temporalmente sin lazy loading)
import MakeReservationPage from './pages/traveler/MakeReservationPage';
import ReservationHistoryPage from './pages/traveler/ReservationHistoryPage';
import UserProfilePage from './pages/traveler/UserProfilePage';
import OperatorProfilePage from './pages/operator/OperatorProfilePage';

// Importar constantes centralizadas
import { ROUTES } from './utils/constants';
import LazyLoadingSpinner from './components/common/LazyLoadingSpinner';
import ReservationErrorBoundary from './components/reservations/ReservationErrorBoundary';

// Función global para navegar a home y hacer scroll a sección
const navigateAndScroll = (navigate, sectionId) => {
  // Si ya estamos en la home, solo hacer scroll
  if (window.location.hash === '#/' || window.location.hash === '') {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }  } else {
    // Si estamos en otra página, navegar a home y luego scroll
    navigate(ROUTES.HOME);
    // Esperar un momento para que la página cargue, luego hacer scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }
};

// Función global para smooth scroll a secciones (solo cuando ya estás en home)
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Componente Navigation para escritorio
const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav style={{ 
      backgroundColor: '#fffada', 
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            cursor: 'pointer'
          }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          <img 
            src="./images/LogoColombiaRaicesNoFondo.png" 
            alt="Colombia Raíces Logo" 
            style={{ 
              height: '40px', 
              width: 'auto' 
            }}
            onError={(e) => {
              console.error('Error loading header logo:', e);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Header logo loaded successfully');
            }}
          />
          <h1 style={{ color: '#03222b', margin: 0, fontSize: '1.5rem' }}>Colombia Raíces</h1>
        </div>          {/* Enlaces de navegación centrales */}
        <div style={{ display: 'flex', gap: '20px' }}>          <button
            onClick={() => navigateAndScroll(navigate, 'experiencias-section')}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#03222b', 
              textDecoration: 'none', 
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🌟 Experiencias
          </button>          <button
            onClick={() => navigateAndScroll(navigate, 'comunidades-section')}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#03222b', 
              textDecoration: 'none', 
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🏘️ Comunidades
          </button>          <button
            onClick={() => {
              alert('🔐 Inicia sesión o regístrate para poder hacer reservas');
            }}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#03222b', 
              textDecoration: 'none', 
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            📅 Reservas
          </button>
        </div>

        {/* Botones de autenticación */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            style={{ 
              border: '2px solid #03222b', 
              color: '#03222b',
              backgroundColor: 'transparent',
              padding: '8px 16px',
              fontSize: '0.9rem',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#03222b';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#03222b';
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            style={{ 
              backgroundColor: '#fbd338', 
              color: '#03222b',
              border: 'none',
              padding: '8px 16px',
              fontSize: '0.9rem',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f2c832';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#fbd338';
            }}
          >
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

// Componente HomePage optimizado para escritorio
const HomePage = () => {
  const navigate = useNavigate();
    // Estado para experiencias
  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(true);
  const [experiencesError, setExperiencesError] = useState(null);
  
  // Estado para comunidades
  const [communities, setCommunities] = useState([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const [communitiesError, setCommunitiesError] = useState(null);
    // Estado para filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    tipo: 'all',
    region: 'all',
    priceRange: 'all'
  });
  
  // Estado para opciones de filtro
  const [filterOptions, setFilterOptions] = useState({
    tipos: [],
    regiones: [],
    priceRanges: []
  });
  
  // Cargar opciones de filtros al montar el componente
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [tiposResponse, regionesResponse, priceRangesResponse] = await Promise.all([
          window.electronAPI.experiencesSimple.getTypes(),
          window.electronAPI.experiencesSimple.getRegions(),
          window.electronAPI.experiencesSimple.getPriceRanges()
        ]);
        
        if (tiposResponse.success && regionesResponse.success && priceRangesResponse.success) {
          setFilterOptions({
            tipos: tiposResponse.data || [],
            regiones: regionesResponse.data || [],
            priceRanges: priceRangesResponse.data?.ranges || []
          });
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);
    // Función para cargar experiencias (con filtros o todas)
  const fetchExperiences = async (filters = null) => {
    try {
      setExperiencesLoading(true);
      let response;
      
      if (filters && (filters.tipo !== 'all' || filters.region !== 'all' || filters.priceRange !== 'all')) {
        // Búsqueda filtrada
        response = await window.electronAPI.experiencesSimple.search(filters);
      } else {
        // Mostrar todas las experiencias
        response = await window.electronAPI.experiencesSimple.getAll();
      }      if (response.success) {
        setExperiences(response.data || []);
        setExperiencesError(null);
      } else {
        setExperiencesError(response.error || 'Error al cargar experiencias');
      }
    } catch (error) {
      setExperiencesError('Error al conectar con la base de datos');
      console.error('Error loading experiences:', error);
    } finally {
      setExperiencesLoading(false);
    }  };
  
  // Función para cargar comunidades
  const fetchCommunities = async () => {
    try {
      setCommunitiesLoading(true);
      const response = await window.electronAPI.communities.getAll();
      
      if (response.success) {
        setCommunities(response.data || []);
        setCommunitiesError(null);
      } else {
        setCommunitiesError(response.error || 'Error al cargar comunidades');
      }
    } catch (error) {
      setCommunitiesError('Error al conectar con la base de datos');
      console.error('Error loading communities:', error);
    } finally {
      setCommunitiesLoading(false);
    }
  };
  
  // Cargar todas las experiencias y comunidades al montar el componente
  useEffect(() => {
    fetchExperiences();
    fetchCommunities();
  }, []);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...searchFilters, [filterType]: value };
    setSearchFilters(newFilters);
    fetchExperiences(newFilters);
  };
  // Limpiar filtros
  const clearFilters = () => {
    const defaultFilters = {
      tipo: 'all',
      region: 'all',
      priceRange: 'all'
    };
    setSearchFilters(defaultFilters);
    fetchExperiences();  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#f8f9fa' }}>
      {/* Estilos para animación de loading */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      {/* Hero Section - Descripción de la app y botones principales */}
      <section style={{ 
        background: 'linear-gradient(135deg, #03222b 0%, #569079 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '24px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Descubre Colombia Raíces
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '32px',
            maxWidth: '768px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Conecta con las comunidades locales y vive experiencias auténticas 
            que preservan nuestro patrimonio cultural y natural. Descubre la 
            Colombia profunda a través del turismo comunitario responsable.
          </p>
            {/* Botones principales de exploración */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>            <button
              onClick={() => scrollToSection('experiencias-section')}
              style={{ 
                backgroundColor: '#fbd338', 
                color: '#03222b',
                border: 'none',
                padding: '16px 32px',
                fontSize: '1.125rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '200px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f2c832';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#fbd338';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🌟 Explorar Experiencias
            </button>
            <button
              onClick={() => scrollToSection('comunidades-section')}
              style={{ 
                border: '2px solid #fbd338', 
                color: '#fbd338',
                backgroundColor: 'transparent',
                padding: '16px 32px',
                fontSize: '1.125rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '200px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#fbd338';
                e.target.style.color = '#03222b';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fbd338';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🏘️ Conocer Comunidades
            </button>
          </div>
        </div>
      </section>      {/* Experiencias Section */}
      <section id="experiencias-section" style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#03222b'
          }}>
            🔍 Explora Nuestras Experiencias
          </h2>
          <p style={{ 
            color: '#666',
            maxWidth: '512px',
            margin: '0 auto 30px auto',
            lineHeight: '1.6'
          }}>
            Encuentra la experiencia perfecta para ti. Filtra por tipo, región y presupuesto.
          </p>
          
          {/* Barra de búsqueda horizontal */}          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '40px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              alignItems: 'end'
            }}>
              {/* Filtro por Tipo */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#03222b'
                }}>
                  🎯 Tipo de Experiencia
                </label>
                <select
                  value={searchFilters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '0.95rem',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
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
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#03222b'
                }}>
                  📍 Región
                </label>
                <select
                  value={searchFilters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '0.95rem',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
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
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#03222b'
                }}>
                  💰 Rango de Precio
                </label>
                <select
                  value={searchFilters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '0.95rem',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
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
                  onClick={clearFilters}
                  style={{
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
                  }}
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

          {/* Resultados de búsqueda */}
          <div style={{
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: 0
            }}>
              {!experiencesLoading && (
                `Mostrando ${experiences.length} experiencia${experiences.length === 1 ? '' : 's'}`
              )}
            </p>
          </div>
              {/* Grid de experiencias */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 350px))',
            gap: '24px',
            justifyContent: 'center'
          }}>
            {experiencesLoading ? (
              // Loading state
              [...Array(3)].map((_, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  textAlign: 'left',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                  <div style={{ 
                    height: '2rem', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginBottom: '16px' 
                  }}></div>
                  <div style={{ 
                    height: '1.5rem', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginBottom: '12px' 
                  }}></div>
                  <div style={{ 
                    height: '3rem', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginBottom: '16px' 
                  }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ 
                      height: '1.2rem', 
                      width: '80px',
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px' 
                    }}></div>
                    <div style={{ 
                      height: '1rem', 
                      width: '60px',
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px' 
                    }}></div>
                  </div>
                </div>
              ))
            ) : experiencesError ? (
              // Error state
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#fff5f5',
                borderRadius: '12px',
                border: '1px solid #fed7d7'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#c53030', marginBottom: '8px' }}>Error al cargar experiencias</h3>
                <p style={{ color: '#718096' }}>{experiencesError}</p>
              </div>
            ) : experiences.length === 0 ? (
              // Empty state
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🌟</div>
                <h3 style={{ color: '#03222b', marginBottom: '8px' }}>No hay experiencias disponibles</h3>
                <p style={{ color: '#666' }}>Próximamente tendremos nuevas experiencias para ti</p>
              </div>
            ) : (
              // Data loaded successfully
              experiences.map((exp) => {
                // Función para obtener icono basado en el tipo o nombre de experiencia
                const getExperienceIcon = (experience) => {
                  const name = experience.nombre?.toLowerCase() || '';
                  const description = experience.descripcion?.toLowerCase() || '';
                  
                  if (name.includes('wayuu') || name.includes('indígena') || description.includes('cultura')) return '🏺';
                  if (name.includes('histórico') || name.includes('colonial') || name.includes('patrimonio')) return '🏛️';
                  if (name.includes('eco') || name.includes('naturaleza') || name.includes('biodiversidad')) return '🌿';
                  if (name.includes('aventura') || name.includes('deportes')) return '🏃‍♂️';
                  if (name.includes('gastronomía') || name.includes('comida')) return '🍽️';
                  if (name.includes('artesanía') || name.includes('arte')) return '🎨';
                  if (name.includes('música') || name.includes('danza')) return '🎵';
                  return '✨'; // Icono por defecto
                };

                // Formatear precio
                const formatPrice = (price) => {
                  if (!price) return 'Consultar precio';
                  const numPrice = parseFloat(price);
                  if (isNaN(numPrice)) return price;
                  return `$${numPrice.toLocaleString('es-CO')}`;
                };

                // Formatear duración
                const formatDuration = (duration) => {
                  if (!duration) return 'Duración variable';
                  if (typeof duration === 'number') {
                    return duration >= 24 ? `${Math.floor(duration/24)}d` : `${duration}h`;
                  }
                  return duration;
                };                return (
                  <div key={exp.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'left',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => {
                    // Mostrar detalles de la experiencia específica en lugar de redirigir inseguramente
                    const experienceInfo = [
                      `🌟 ${exp.nombre}`,
                      `📍 ${exp.ubicacion || 'Ubicación por confirmar'}`,
                      `💰 ${formatPrice(exp.precio)}`,
                      `⏰ ${formatDuration(exp.duracion_horas)}`,
                      `📝 ${exp.descripcion?.substring(0, 200)}${exp.descripcion?.length > 200 ? '...' : ''}`,
                      '',
                      '💡 Próximamente: página de detalles completa'
                    ].join('\n');
                    
                    alert(experienceInfo);
                  }}
                  >
                    {/* Imagen de la experiencia */}
                    <div style={{ 
                      height: '200px',
                      backgroundImage: `url(${exp.image_url || `./images/experiences/experience_${exp.id}_thumbnail.jpg`})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      {/* Overlay con ícono de categoría */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        fontSize: '1.2rem'
                      }}>
                        {getExperienceIcon(exp)}
                      </div>
                    </div>
                    {/* Contenido de la card */}
                    <div style={{ padding: '24px' }}>
                    <h3 style={{ 
                      color: '#03222b', 
                      marginBottom: '12px',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>
                      {exp.nombre || 'Experiencia sin nombre'}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      marginBottom: '16px', 
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {exp.descripcion || 'Descripción no disponible'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        color: '#03222b', 
                        fontWeight: 'bold', 
                        fontSize: '1.2rem' 
                      }}>
                        {formatPrice(exp.precio)}
                      </span>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>
                        ⏱️ {formatDuration(exp.duracion_horas)}
                      </span>
                    </div>                    {exp.ubicacion && (
                      <div style={{ 
                        marginTop: '12px',
                        fontSize: '0.875rem',
                        color: '#718096',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📍 {exp.ubicacion}
                      </div>
                    )}
                    </div>
                  </div>
                );
              })
            )}          </div>
        </div>
      </section>      {/* Comunidades Section */}
      <section id="comunidades-section" style={{ padding: '64px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#03222b'
          }}>
            🏘️ Descubre Nuestras Comunidades
          </h2>
          <p style={{ 
            color: '#666',
            maxWidth: '512px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Conoce las comunidades que hacen posible estas experiencias únicas y auténticas.
          </p>

          {/* Grid de comunidades */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 350px))',
            gap: '24px',
            justifyContent: 'center'
          }}>
            {communitiesLoading ? (
              // Loading state
              [...Array(3)].map((_, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  textAlign: 'left',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                  <div style={{ 
                    height: '2rem', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginBottom: '16px' 
                  }}></div>
                  <div style={{ 
                    height: '1.5rem', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginBottom: '12px' 
                  }}></div>
                  <div style={{ 
                    height: '3rem', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginBottom: '16px' 
                  }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ 
                      height: '1.2rem', 
                      width: '80px',
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px' 
                    }}></div>
                    <div style={{ 
                      height: '1rem', 
                      width: '60px',
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px' 
                    }}></div>
                  </div>
                </div>
              ))
            ) : communitiesError ? (
              // Error state
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#fff5f5',
                borderRadius: '12px',
                border: '1px solid #fed7d7'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#c53030', marginBottom: '8px' }}>Error al cargar comunidades</h3>
                <p style={{ color: '#718096' }}>{communitiesError}</p>
              </div>
            ) : communities.length === 0 ? (
              // Empty state
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🏘️</div>
                <h3 style={{ color: '#03222b', marginBottom: '8px' }}>No hay comunidades disponibles</h3>
                <p style={{ color: '#666' }}>Próximamente tendremos nuevas comunidades para conocer</p>
              </div>
            ) : (
              // Communities grid
              communities.map((community) => {
                return (
                  <div key={community.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'left',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}                  onClick={() => {
                    // Mostrar detalles de la comunidad específica
                    const communityInfo = [
                      `🏘️ ${community.name}`,
                      `📍 ${community.region}`,
                      `📝 ${community.description?.substring(0, 200)}${community.description?.length > 200 ? '...' : ''}`,
                      '',
                      '💡 Próximamente: página de detalles completa'
                    ].join('\n');
                    
                    alert(communityInfo);
                  }}
                  >
                    {/* Imagen de la comunidad */}
                    <div style={{ 
                      height: '200px',
                      backgroundImage: `url(./images/communities/community_${community.id}.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      {/* Overlay con información de región */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(251, 211, 56, 0.9)',
                        color: '#03222b',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {community.region}
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div style={{ padding: '20px' }}>                      <h3 style={{ 
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#03222b'
                      }}>
                        {community.name}
                      </h3>
                      
                      <p style={{ 
                        color: '#666',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        marginBottom: '16px'
                      }}>
                        {community.description?.substring(0, 100)}
                        {community.description?.length > 100 ? '...' : ''}
                      </p>

                      {/* Información adicional */}
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.875rem',
                          color: '#718096'
                        }}>
                          📍 {community.region}
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.875rem',
                          color: '#fbd338',
                          fontWeight: '600'
                        }}>
                          Ver más →
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })            )}
          </div>
          
          {/* Botón para ver todas las experiencias */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => navigate(ROUTES.EXPERIENCES)}
              style={{
                backgroundColor: '#03222b',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2a5a6b';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#03222b';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Ver todas las experiencias →
            </button>
          </div>
        </div>
      </section>

      {/* Debug info */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        zIndex: 1000
      }}>
        🖥️ Desktop App | {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

// Componente que condicionalmente renderiza Navigation
const ConditionalNavigation = () => {
  const location = useLocation();
  // Rutas que NO deben mostrar el header genérico
  const dashboardRoutes = [
    ROUTES.TRAVELER_DASHBOARD,
    ROUTES.OPERATOR_DASHBOARD,
    ROUTES.PUBLISH_EXPERIENCE,
    ROUTES.MANAGE_EXPERIENCES,
    ROUTES.EDIT_EXPERIENCE,
    ROUTES.OPERATOR_RESERVATIONS,
    ROUTES.EXPERIENCES,
    ROUTES.COMMUNITIES,
    ROUTES.RESERVATIONS,
    ROUTES.MAKE_RESERVATION,
    ROUTES.RESERVATION_HISTORY,
    ROUTES.PROFILE,
    ROUTES.OPERATOR_PROFILE,
    // Rutas de admin
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.APPROVE_EXPERIENCES
  ];
  
  // Para HashRouter, verificar tanto pathname como hash
  const currentPath = location.pathname;
  const currentHash = location.hash;
  
  // Verificar si estamos en una ruta de dashboard
  const shouldHideNavigation = dashboardRoutes.some(route => {
    return currentPath === route || 
           currentPath.endsWith(route) ||
           currentHash === `#${route}` ||
           currentHash.endsWith(route);
  });
  
  if (shouldHideNavigation) {
    return null;
  }
  
  return <Navigation />;
};

function App() {  return (
    <Router>
      <div className="App">
        <ConditionalNavigation />
        <main><Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.EXPERIENCES} element={<ExperiencesPage />} />
            <Route path={ROUTES.COMMUNITIES} element={<CommunitiesPage />} />
            <Route path={ROUTES.RESERVATIONS} element={<ReservationsPage />} />            {/* Rutas específicas de reservas con lazy loading y error boundary */}            <Route path={ROUTES.MAKE_RESERVATION} element={<MakeReservationPage />} />
            <Route path={ROUTES.RESERVATION_HISTORY} element={<ReservationHistoryPage />} />
            
            <Route path={ROUTES.DASHBOARD} element={<UnderConstructionPage pageName="Dashboard" />} />            <Route path={ROUTES.TRAVELER_DASHBOARD} element={<TravelerDashboard />} />
            <Route path={ROUTES.PROFILE} element={<UserProfilePage />} />
            <Route path={ROUTES.OPERATOR_DASHBOARD} element={<OperatorDashboard />} />
            <Route path={ROUTES.OPERATOR_PROFILE} element={<OperatorProfilePage />} />
            <Route path={ROUTES.PUBLISH_EXPERIENCE} element={<PublishExperiencePage />} />
            <Route path={ROUTES.MANAGE_EXPERIENCES} element={<ManageExperiencesPage />} />
            <Route path={`${ROUTES.EDIT_EXPERIENCE}/:experienceId`} element={<EditExperiencePage />} />
            <Route path={ROUTES.OPERATOR_RESERVATIONS} element={<OperatorReservationsPage />} />
            
            {/* Rutas de admin */}
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.APPROVE_EXPERIENCES} element={<ApproveExperiencesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
