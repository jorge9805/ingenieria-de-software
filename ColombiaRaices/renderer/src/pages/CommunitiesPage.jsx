// Página de Comunidades
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { ROUTES, REGIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TravelerHeader from '../components/traveler/TravelerHeader';
import CommunitySearchFilters from '../components/communities/CommunitySearchFilters';
import CommunityCard from '../components/communities/CommunityCard';

const CommunitiesPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  
  // Estado para filtros de comunidades
  const [searchFilters, setSearchFilters] = useState({
    nombre: '',
    region: 'all'
  });

  // Función para cargar comunidades (con filtros o todas)
  const fetchCommunities = async (filters = null) => {
    try {
      setLoading(true);
      let response;
      
      if (filters && (filters.nombre || (filters.region && filters.region !== 'all'))) {
        // Búsqueda filtrada por nombre o región
        const filteredCommunities = communities.filter(community => {
          const matchesName = !filters.nombre || 
            community.name?.toLowerCase().includes(filters.nombre.toLowerCase()) ||
            community.nombre?.toLowerCase().includes(filters.nombre.toLowerCase());
          
          const matchesRegion = !filters.region || filters.region === 'all' || 
            community.region === filters.region;
          
          return matchesName && matchesRegion;
        });
        
        setCommunities(filteredCommunities);
        setLoading(false);
        return;
      } else {
        // Cargar todas las comunidades de la base de datos
        response = await window.electronAPI.communities.getAll();
      }
      
      if (response.success) {
        setCommunities(response.data || []);
      } else {
        console.error('Error loading communities:', response.error);
        setCommunities([]);
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar comunidades reales de la base de datos
    const loadInitialCommunities = async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.communities.getAll();
        
        if (response.success) {
          setCommunities(response.data || []);
        } else {
          console.error('Error loading communities:', response.error);
          setCommunities([]);
        }
      } catch (error) {
        console.error('Error connecting to database:', error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCommunities();
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...searchFilters, [filterType]: value };
    setSearchFilters(newFilters);
    
    // Filtrar comunidades en tiempo real
    if (value === '' && filterType === 'nombre') {
      // Si se limpia el nombre, recargar todas las comunidades
      fetchCommunities({ ...newFilters, nombre: '' });
    } else {
      fetchCommunities(newFilters);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    const defaultFilters = {
      nombre: '',
      region: 'all'
    };
    setSearchFilters(defaultFilters);
    fetchCommunities(); // Recargar todas las comunidades
  };

  // Filtrar comunidades localmente para los resultados en tiempo real
  const filteredCommunities = communities.filter(community => {
    const matchesName = !searchFilters.nombre || 
      community.name?.toLowerCase().includes(searchFilters.nombre.toLowerCase()) ||
      community.nombre?.toLowerCase().includes(searchFilters.nombre.toLowerCase());
    
    const matchesRegion = !searchFilters.region || searchFilters.region === 'all' || 
      community.region === searchFilters.region;
    
    return matchesName && matchesRegion;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TravelerHeader con Comunidades activo */}
      <TravelerHeader currentPage="communities" />
      
      {/* Community Search Filters */}
      <CommunitySearchFilters
        searchFilters={searchFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showTitle={false}
        showDescription={false}
        layout="horizontal"
      />

      {/* Communities Grid */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Mostrando {filteredCommunities.length} comunidades
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 320px))',
            gap: '24px',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {filteredCommunities.map((community) => (
              <CommunityCard 
                key={community.id} 
                community={community} 
              />
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1',
              textAlign: 'center', 
              padding: '48px 20px' 
            }}>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '16px' }}>
                No se encontraron comunidades con los filtros seleccionados.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: '#10b981',
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
                  e.target.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                }}
              >
                Ver Todas las Comunidades
              </button>
            </div>
          )}
        </div>
      </section>
    </div>  );
};

export default CommunitiesPage;
