// Hook personalizado para gestionar experiencias turísticas
// Conecta con ExperienceService del main process via IPC

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para gestionar experiencias
 * Integra con ExperienceController via IPC
 */
const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // 1. BÚSQUEDA Y LISTADO
  // ============================================

  /**
   * Buscar experiencias con filtros
   */
  const searchExperiences = useCallback(async (searchFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        // Usar IPC para comunicarse con el main process
        const result = await window.electronAPI.experiences.search(searchFilters);
        
        if (result.success) {
          setExperiences(result.experiences || []);
          setFilters(searchFilters);
          return result;
        } else {
          throw new Error(result.error || 'Error searching experiences');
        }
      } else {
        // Fallback para desarrollo web - usar datos mock
        console.warn('ElectronAPI no disponible, usando datos mock');
        const mockExperiences = [
          {
            id: 1,
            title: 'Aventura en Barichara',
            description: 'Experiencia cultural única en el pueblo más bonito de Colombia',
            type: 'cultural',
            price: 150000,
            duration: 8,
            maxParticipants: 12,
            community: {
              id: 1,
              name: 'Barichara',
              region: 'Santander'
            },
            operatorId: 1,
            isActive: true
          },
          {
            id: 2,
            title: 'Experiencia Wayuu en La Guajira',
            description: 'Vive la cultura ancestral wayuu con artesanías y tradiciones',
            type: 'cultural',
            price: 120000,
            duration: 6,
            maxParticipants: 8,
            community: {
              id: 2,
              name: 'Comunidad Wayuu',
              region: 'La Guajira'
            },
            operatorId: 2,
            isActive: true
          },
          {
            id: 3,
            title: 'Ecoturismo en el Chocó',
            description: 'Explora la biodiversidad única del Chocó biogeográfico',
            type: 'ecologica',
            price: 180000,
            duration: 10,
            maxParticipants: 6,
            community: {
              id: 3,
              name: 'Nuquí',
              region: 'Chocó'
            },
            operatorId: 3,
            isActive: true
          }
        ];
        
        // Aplicar filtros básicos
        let filteredExperiences = mockExperiences;
        
        if (searchFilters.type) {
          filteredExperiences = filteredExperiences.filter(exp => exp.type === searchFilters.type);
        }
        
        if (searchFilters.minPrice || searchFilters.maxPrice) {
          filteredExperiences = filteredExperiences.filter(exp => {
            const price = exp.price;
            return (!searchFilters.minPrice || price >= searchFilters.minPrice) &&
                   (!searchFilters.maxPrice || price <= searchFilters.maxPrice);
          });
        }
        
        if (searchFilters.region) {
          filteredExperiences = filteredExperiences.filter(exp => 
            exp.community.region.toLowerCase().includes(searchFilters.region.toLowerCase())
          );
        }
        
        setExperiences(filteredExperiences);
        setFilters(searchFilters);
        
        return {
          success: true,
          experiences: filteredExperiences,
          total: filteredExperiences.length
        };
      }
    } catch (error) {
      setError(error.message);
      setExperiences([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener experiencias populares
   */
  const getPopularExperiences = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.getPopular({ limit });
        
        if (result.success) {
          return result.experiences || [];
        } else {
          throw new Error(result.error || 'Error getting popular experiences');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando datos mock');
        const mockPopular = experiences.slice(0, limit);
        return mockPopular;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [experiences]);

  /**
   * Obtener experiencias recientes
   */
  const getRecentExperiences = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.getRecent({ limit });
        
        if (result.success) {
          return result.experiences || [];
        } else {
          throw new Error(result.error || 'Error getting recent experiences');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando datos mock');
        const mockRecent = experiences.slice(0, limit);
        return mockRecent;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [experiences]);

  // ============================================
  // 2. GESTIÓN DE EXPERIENCIAS
  // ============================================

  /**
   * Crear nueva experiencia
   */
  const createExperience = useCallback(async (experienceData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.create(experienceData);
        
        if (result.success) {
          // Refrescar la lista de experiencias
          await searchExperiences(filters);
          return result;
        } else {
          throw new Error(result.error || 'Error creating experience');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        const newExperience = {
          id: Date.now(),
          ...experienceData,
          isActive: true
        };
        
        setExperiences(prev => [newExperience, ...prev]);
        return { success: true, experience: newExperience };
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [filters, searchExperiences]);

  /**
   * Actualizar experiencia existente
   */
  const updateExperience = useCallback(async (experienceId, updateData, operatorId, isAdmin = false) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.update({
          experienceId,
          updateData,
          operatorId,
          isAdmin
        });
        
        if (result.success) {
          // Refrescar la lista de experiencias
          await searchExperiences(filters);
          return result;
        } else {
          throw new Error(result.error || 'Error updating experience');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        setExperiences(prev => prev.map(exp => 
          exp.id === experienceId ? { ...exp, ...updateData } : exp
        ));
        return { success: true, message: 'Experience updated successfully' };
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [filters, searchExperiences]);

  /**
   * Eliminar experiencia
   */
  const deleteExperience = useCallback(async (experienceId, operatorId, isAdmin = false) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.delete({
          experienceId,
          operatorId,
          isAdmin
        });
        
        if (result.success) {
          // Refrescar la lista de experiencias
          await searchExperiences(filters);
          return result;
        } else {
          throw new Error(result.error || 'Error deleting experience');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
        return { success: true, message: 'Experience deleted successfully' };
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [filters, searchExperiences]);

  // ============================================
  // 3. CÁLCULOS Y DISPONIBILIDAD
  // ============================================

  /**
   * Calcular disponibilidad de una experiencia
   */
  const calculateAvailability = useCallback(async (experienceId, date, participants) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.calculateAvailability({
          experienceId,
          date,
          participants
        });
        
        if (result.success) {
          return result.availability;
        } else {
          throw new Error(result.error || 'Error calculating availability');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        const experience = experiences.find(exp => exp.id === experienceId);
        if (experience) {
          return {
            available: true,
            availableSpots: experience.maxParticipants - 2, // Simular algunos reservados
            canAccommodate: participants <= (experience.maxParticipants - 2),
            maxParticipants: experience.maxParticipants,
            reservedParticipants: 2,
            requestedParticipants: participants
          };
        }
        throw new Error('Experience not found');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [experiences]);

  /**
   * Calcular precio total con descuentos
   */
  const calculatePrice = useCallback(async (experienceId, participants) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.calculatePrice({
          experienceId,
          participants
        });
        
        if (result.success) {
          return result.priceInfo;
        } else {
          throw new Error(result.error || 'Error calculating price');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        const experience = experiences.find(exp => exp.id === experienceId);
        if (experience) {
          const baseTotal = experience.price * participants;
          let discountPercentage = 0;
          let discountReason = '';
          
          if (participants >= 8) {
            discountPercentage = 0.1;
            discountReason = 'Descuento por grupo grande';
          }
          
          const discountAmount = baseTotal * discountPercentage;
          const finalTotal = baseTotal - discountAmount;
          
          return {
            baseTotal,
            discountPercentage,
            discountAmount,
            finalTotal,
            discountReason
          };
        }
        throw new Error('Experience not found');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [experiences]);

  // ============================================
  // 4. ESTADÍSTICAS Y REPORTES
  // ============================================

  /**
   * Obtener estadísticas de experiencias
   */
  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.getStats();
        
        if (result.success) {
          setStats(result.stats);
          return result.stats;
        } else {
          throw new Error(result.error || 'Error getting stats');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        const mockStats = {
          total: experiences.length,
          byType: [
            { type: 'cultural', count: 2 },
            { type: 'ecologica', count: 1 },
            { type: 'historica', count: 0 }
          ],
          averagePrice: 150000
        };
        setStats(mockStats);
        return mockStats;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [experiences]);

  /**
   * Obtener experiencias por operador
   */
  const getExperiencesByOperator = useCallback(async (operatorId) => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.getByOperator({ operatorId });
        
        if (result.success) {
          return result.experiences || [];
        } else {
          throw new Error(result.error || 'Error getting experiences by operator');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando simulación');
        const operatorExperiences = experiences.filter(exp => exp.operatorId === operatorId);
        return operatorExperiences;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [experiences]);

  // ============================================
  // 5. EFECTOS Y UTILIDADES
  // ============================================

  /**
   * Cargar experiencias al montar el componente
   */
  useEffect(() => {
    searchExperiences();
  }, [searchExperiences]);

  /**
   * Actualizar filtros aplicados
   */
  const updateFilters = useCallback((newFilters) => {
    searchExperiences(newFilters);
  }, [searchExperiences]);

  /**
   * Limpiar experiencias
   */
  const clearExperiences = useCallback(() => {
    setExperiences([]);
    setFilters({});
  }, []);

  // Retornar todas las funciones y estados
  return {
    // Estados
    experiences,
    loading,
    error,
    filters,
    stats,
    
    // Funciones de búsqueda
    searchExperiences,
    getPopularExperiences,
    getRecentExperiences,
    
    // Funciones de gestión
    createExperience,
    updateExperience,
    deleteExperience,
    
    // Funciones de cálculo
    calculateAvailability,
    calculatePrice,
    
    // Funciones de estadísticas
    getStats,
    getExperiencesByOperator,
    
    // Utilidades
    clearError,
    updateFilters,
    clearExperiences
  };
};

export default useExperiences;
