// Hook personalizado para el manejo de aprobaciones de experiencias
// Proporciona funcionalidad centralizada para el sistema de aprobación

import { useState, useCallback } from 'react';
import {
  validateAdminPermissions,
  generateApprovalConfirmation,
  generateRejectionConfirmation,
  formatApprovalNotification,
  validateExperienceForApproval,
  handleApprovalError,
  logApprovalAction
} from '../utils/approval';

const useApproval = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  /**
   * Obtiene datos del usuario actual
   */
  const getCurrentUser = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch (error) {
      console.error('Error getting current user:', error);
      return {};
    }
  }, []);

  /**
   * Aprueba una experiencia con validaciones y confirmaciones
   */
  const approveExperience = useCallback(async (experience, onSuccess = null, onError = null) => {
    // Validar permisos de admin
    if (!validateAdminPermissions()) {
      const errorMsg = 'No tienes permisos de administrador para aprobar experiencias';
      onError?.(new Error(errorMsg));
      return { success: false, error: errorMsg };
    }

    // Validar datos de la experiencia
    const validation = validateExperienceForApproval(experience);
    if (!validation.isValid) {
      const errorMsg = `Experiencia inválida: ${validation.errors.join(', ')}`;
      onError?.(new Error(errorMsg));
      return { success: false, error: errorMsg };
    }

    // Confirmación del usuario
    const confirmMessage = generateApprovalConfirmation(experience);
    if (!window.confirm(confirmMessage)) {
      return { success: false, error: 'Aprobación cancelada por el usuario' };
    }

    setIsProcessing(true);
    
    try {
      const userData = getCurrentUser();
      
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.update({
          experienceId: experience.id,
          updateData: { is_active: 1 },
          operatorId: userData.id,
          isAdmin: true
        });
        
        if (result.success) {
          const notification = formatApprovalNotification(experience, 'approved');
          
          // Log de la acción
          logApprovalAction('APPROVED', experience, userData);
          
          setLastAction({
            type: 'approval',
            experienceId: experience.id,
            experienceTitle: experience.title,
            timestamp: new Date().toISOString()
          });
          
          // Mostrar notificación de éxito
          alert(notification);
          
          onSuccess?.(result);
          return result;
        } else {
          throw new Error(result.error || 'Error al aprobar experiencia');
        }
      } else {
        // Fallback para desarrollo
        console.warn('ElectronAPI no disponible, simulando aprobación');
        const notification = formatApprovalNotification(experience, 'approved');
        alert(`${notification}\n\n(Modo desarrollo)`);
        
        onSuccess?.({ success: true, message: 'Simulated approval' });
        return { success: true, message: 'Simulated approval' };
      }
    } catch (error) {
      const errorMessage = handleApprovalError(error, 'aprobar');
      onError?.(error);
      alert(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [getCurrentUser]);

  /**
   * Rechaza y elimina una experiencia con validaciones y confirmaciones
   */
  const rejectExperience = useCallback(async (experience, onSuccess = null, onError = null) => {
    // Validar permisos de admin
    if (!validateAdminPermissions()) {
      const errorMsg = 'No tienes permisos de administrador para rechazar experiencias';
      onError?.(new Error(errorMsg));
      return { success: false, error: errorMsg };
    }

    // Confirmación del usuario (más estricta para eliminación)
    const confirmMessage = generateRejectionConfirmation(experience);
    if (!window.confirm(confirmMessage)) {
      return { success: false, error: 'Rechazo cancelado por el usuario' };
    }

    // Segunda confirmación para acción irreversible
    const secondConfirm = window.confirm(
      '🚨 ÚLTIMA CONFIRMACIÓN\n\n' +
      'Esta acción eliminará permanentemente la experiencia y NO se puede deshacer.\n\n' +
      '¿Estás completamente seguro?'
    );
    
    if (!secondConfirm) {
      return { success: false, error: 'Rechazo cancelado por el usuario' };
    }

    setIsProcessing(true);
    
    try {
      const userData = getCurrentUser();
      
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.delete({
          experienceId: experience.id,
          operatorId: userData.id,
          isAdmin: true
        });
        
        if (result.success) {
          const notification = formatApprovalNotification(experience, 'rejected');
          
          // Log de la acción
          logApprovalAction('REJECTED', experience, userData);
          
          setLastAction({
            type: 'rejection',
            experienceId: experience.id,
            experienceTitle: experience.title,
            timestamp: new Date().toISOString()
          });
          
          // Mostrar notificación de éxito
          alert(notification);
          
          onSuccess?.(result);
          return result;
        } else {
          throw new Error(result.error || 'Error al rechazar experiencia');
        }
      } else {
        // Fallback para desarrollo
        console.warn('ElectronAPI no disponible, simulando rechazo');
        const notification = formatApprovalNotification(experience, 'rejected');
        alert(`${notification}\n\n(Modo desarrollo)`);
        
        onSuccess?.({ success: true, message: 'Simulated rejection' });
        return { success: true, message: 'Simulated rejection' };
      }
    } catch (error) {
      const errorMessage = handleApprovalError(error, 'rechazar');
      onError?.(error);
      alert(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [getCurrentUser]);

  /**
   * Aprueba múltiples experiencias en lote
   */
  const approveBatch = useCallback(async (experiences, onProgress = null, onComplete = null) => {
    if (!validateAdminPermissions()) {
      alert('No tienes permisos de administrador para aprobar experiencias');
      return { success: false, error: 'Insufficient permissions' };
    }

    if (!experiences || experiences.length === 0) {
      return { success: false, error: 'No experiences to approve' };
    }

    const confirmMessage = `¿Confirmas la aprobación en lote de ${experiences.length} experiencia(s)?

Esta acción aprobará todas las experiencias seleccionadas.`;
    
    if (!window.confirm(confirmMessage)) {
      return { success: false, error: 'Batch approval cancelled' };
    }

    setIsProcessing(true);
    const results = [];
    
    try {
      for (let i = 0; i < experiences.length; i++) {
        const experience = experiences[i];
        onProgress?.(i + 1, experiences.length, experience.title);
        
        const result = await approveExperience(experience);
        results.push({ experienceId: experience.id, result });
        
        // Pequeña pausa para evitar saturar el sistema
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const successful = results.filter(r => r.result.success).length;
      const failed = results.length - successful;
      
      const summary = `Aprobación en lote completada:
✅ Exitosas: ${successful}
❌ Fallidas: ${failed}`;
      
      alert(summary);
      onComplete?.(results);
      
      return { 
        success: true, 
        results, 
        summary: { successful, failed, total: experiences.length }
      };
    } catch (error) {
      const errorMessage = handleApprovalError(error, 'procesar lote');
      alert(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [approveExperience]);

  /**
   * Obtiene estadísticas de la última sesión de aprobación
   */
  const getSessionStats = useCallback(() => {
    return {
      lastAction,
      isProcessing,
      hasAdminPermissions: validateAdminPermissions()
    };
  }, [lastAction, isProcessing]);

  return {
    // Estados
    isProcessing,
    lastAction,
    
    // Acciones principales
    approveExperience,
    rejectExperience,
    approveBatch,
    
    // Utilidades
    getSessionStats,
    validateAdminPermissions,
    getCurrentUser
  };
};

export default useApproval;
