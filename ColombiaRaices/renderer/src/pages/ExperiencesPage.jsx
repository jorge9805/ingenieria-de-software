// Página de Experiencias
import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { ROUTES, EXPERIENCE_TYPES, REGIONS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchFilters from '../components/common/SearchFilters';
import TravelerHeader from '../components/traveler/TravelerHeader';
import ExperienceCard from '../components/experiences/ExperienceCard';

const ExperiencesPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  
  // Estado para filtros (compatible con SearchFilters)
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
  });// Cargar opciones de filtros al montar el componente
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
      setLoading(true);
      let response;
      
      if (filters && (filters.tipo !== 'all' || filters.region !== 'all' || filters.priceRange !== 'all')) {
        // Búsqueda filtrada
        response = await window.electronAPI.experiencesSimple.search(filters);
      } else {
        // Mostrar todas las experiencias
        response = await window.electronAPI.experiencesSimple.getAll();
      }
      
      if (response.success) {
        setExperiences(response.data || []);
      } else {
        console.error('Error loading experiences:', response.error);
        setExperiences([]);
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar experiencias reales de la base de datos
    const fetchExperiences = async () => {
      try {
        setLoading(true);        const response = await window.electronAPI.experiencesSimple.getAll();
        
        if (response.success) {
          setExperiences(response.data || []);
        } else {
          console.error('Error loading experiences:', response.error);
          setExperiences([]);
        }
      } catch (error) {
        console.error('Error connecting to database:', error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };    fetchExperiences();
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...searchFilters, [filterType]: value };
    setSearchFilters(newFilters);
    fetchExperiences(newFilters);
  };  // Limpiar filtros
  const clearFilters = () => {
    const defaultFilters = {
      tipo: 'all',
      region: 'all',
      priceRange: 'all'
    };
    setSearchFilters(defaultFilters);
    fetchExperiences();
  };// Como ahora la filtración se hace en el servidor, ya no necesitamos filtrado local
  // Solo mostramos las experiencias que ya vienen filtradas del backend

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gray-50">
      {/* TravelerHeader */}
      <TravelerHeader currentPage="experiences" />
      
      {/* Search Filters */}
      <SearchFilters
        searchFilters={searchFilters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showTitle={false}
        showDescription={false}
        layout="horizontal"
      />      {/* Experiences Grid */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Mostrando {experiences.length} experiencias
            </p>
          </div>          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 320px))',
            gap: '24px',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {experiences.map((experience) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
              />
            ))}
          </div>{experiences.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1',
              textAlign: 'center', 
              padding: '48px 20px' 
            }}>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '16px' }}>
                No se encontraron experiencias con los filtros seleccionados.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: '#fbd338',
                  color: '#03222b',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  fontWeight: '600',
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
                Ver Todas las Experiencias
              </button>
            </div>          )}
        </div>
      </section>
    </div>
  );
};

export default ExperiencesPage;
