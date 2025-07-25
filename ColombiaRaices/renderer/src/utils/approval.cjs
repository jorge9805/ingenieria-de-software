// Utilidades para el sistema de aprobación de experiencias (CommonJS version for testing)
// Funciones helper para mejorar la UX y funcionalidad del sistema de aprobación

/**
 * Formatea el estado de aprobación para mostrar al usuario
 * @param {Object} experience - Experiencia
 * @returns {Object} - Estado formateado
 */
const formatApprovalStatus = (experience) => {
  const isActive = experience.is_active === 1;
  
  return {
    status: isActive ? 'approved' : 'pending',
    label: isActive ? 'Aprobada' : 'Pendiente',
    color: isActive ? '#28a745' : '#ffc107',
    bgColor: isActive ? '#d4edda' : '#fff3cd',
    icon: isActive ? '✅' : '⏳'
  };
};

/**
 * Valida si un usuario tiene permisos de administrador
 * @returns {boolean} - True si es admin
 */
const validateAdminPermissions = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.userType === 'admin' || userData.role === 'admin';
  } catch (error) {
    console.error('Error validating admin permissions:', error);
    return false;
  }
};

/**
 * Genera mensaje de confirmación personalizado para aprobación
 * @param {Object} experience - Experiencia a aprobar
 * @returns {string} - Mensaje de confirmación
 */
const generateApprovalConfirmation = (experience) => {
  return `¿Confirmas la aprobación de la experiencia "${experience.title}"?

📋 Detalles:
• Operador: ${experience.operator_name}
• Comunidad: ${experience.community_name}
• Precio: $${experience.price?.toLocaleString()}
• Duración: ${experience.duration} horas

✅ Al aprobar, la experiencia será visible para todos los usuarios.`;
};

/**
 * Genera mensaje de confirmación para rechazo con advertencia
 * @param {Object} experience - Experiencia a rechazar
 * @returns {string} - Mensaje de confirmación
 */
const generateRejectionConfirmation = (experience) => {
  return `⚠️ CONFIRMACIÓN DE RECHAZO ⚠️

Vas a rechazar la experiencia: "${experience.title}"
Operador: ${experience.operator_name}

❌ Esta acción NO se puede deshacer y eliminará permanentemente la experiencia del sistema.
El operador recibirá una notificación del rechazo.

¿Estás seguro de continuar?`;
};

/**
 * Formatea mensaje de notificación después de una acción
 * @param {Object} experience - Experiencia procesada
 * @param {string} action - Acción realizada ('approved', 'rejected')
 * @returns {string} - Mensaje formateado
 */
const formatApprovalNotification = (experience, action) => {
  const isApproved = action === 'approved';
  const icon = isApproved ? '✅' : '❌';
  const actionText = isApproved ? 'aprobada exitosamente' : 'rechazada exitosamente';
  
  return `${icon} La experiencia "${experience.title}" de ${experience.operator_name} ha sido ${actionText}.`;
};

/**
 * Valida que una experiencia tenga todos los datos requeridos para aprobación
 * @param {Object} experience - Experiencia a validar
 * @returns {Object} - Resultado de validación
 */
const validateExperienceForApproval = (experience) => {
  const errors = [];
  
  // Validaciones requeridas
  if (!experience.title || experience.title.length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }
  
  if (!experience.description || experience.description.length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }
  
  if (!experience.price || experience.price <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }
  
  if (!experience.duration || experience.duration <= 0) {
    errors.push('La duración debe ser mayor a 0');
  }
  
  if (!experience.maxParticipants || experience.maxParticipants <= 0) {
    errors.push('El número máximo de participantes debe ser mayor a 0');
  }
  
  if (!experience.operator_name || experience.operator_name.length < 2) {
    errors.push('El nombre del operador es requerido');
  }
  
  if (!experience.operator_email || !experience.operator_email.includes('@')) {
    errors.push('El email del operador debe ser válido');
  }
  
  if (!experience.community_name || experience.community_name.length < 2) {
    errors.push('El nombre de la comunidad es requerido');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warningCount: errors.length
  };
};

/**
 * Extrae resumen de información clave de una experiencia
 * @param {Object} experience - Experiencia
 * @returns {Object} - Resumen
 */
const extractExperienceSummary = (experience) => {
  return {
    id: experience.id,
    title: experience.title,
    operator: experience.operator_name,
    community: experience.community_name,
    region: experience.community_region,
    price: experience.price,
    duration: experience.duration,
    participants: experience.maxParticipants,
    type: experience.type,
    status: formatApprovalStatus(experience),
    createdAt: experience.created_at,
    validation: validateExperienceForApproval(experience)
  };
};

/**
 * Genera estadísticas de experiencias pendientes para el dashboard de admin
 * @param {Array} experiences - Lista de experiencias pendientes
 * @returns {Object} - Estadísticas
 */
const generateApprovalStats = (experiences) => {
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return {
      total: 0,
      byType: {},
      byRegion: {},
      byOperator: {},
      avgPrice: 0,
      avgDuration: 0,
      validationIssues: 0,
      recentSubmissions: 0
    };
  }

  const stats = {
    total: experiences.length,
    byType: {},
    byRegion: {},
    byOperator: {},
    avgPrice: 0,
    avgDuration: 0,
    validationIssues: 0,
    recentSubmissions: 0
  };

  let totalPrice = 0;
  let totalDuration = 0;
  const recentDate = new Date();
  recentDate.setHours(recentDate.getHours() - 24); // Últimas 24 horas

  experiences.forEach(exp => {
    // Conteo por tipo
    stats.byType[exp.type] = (stats.byType[exp.type] || 0) + 1;
    
    // Conteo por región
    const region = exp.community_region || 'Sin región';
    stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
    
    // Conteo por operador
    stats.byOperator[exp.operator_name] = (stats.byOperator[exp.operator_name] || 0) + 1;
    
    // Cálculos de promedio
    totalPrice += exp.price || 0;
    totalDuration += exp.duration || 0;
    
    // Validación
    const validation = validateExperienceForApproval(exp);
    if (!validation.isValid) {
      stats.validationIssues++;
    }
    
    // Submisiones recientes
    const createdAt = new Date(exp.created_at);
    if (createdAt > recentDate) {
      stats.recentSubmissions++;
    }
  });

  stats.avgPrice = Math.round(totalPrice / experiences.length);
  stats.avgDuration = Math.round(totalDuration / experiences.length);

  return stats;
};

/**
 * Maneja errores de aprobación de forma consistente
 * @param {Error} error - Error ocurrido
 * @param {string} context - Contexto donde ocurrió el error
 * @returns {Object} - Error formateado para mostrar al usuario
 */
const handleApprovalError = (error, context = 'approval') => {
  console.error(`Approval Error [${context}]:`, error);
  
  const userFriendlyMessages = {
    'Network Error': 'Error de conexión. Verifica tu conexión a internet.',
    'Permission denied': 'No tienes permisos para realizar esta acción.',
    'Experience not found': 'La experiencia ya no existe o fue eliminada.',
    'Validation failed': 'Los datos de la experiencia no son válidos.',
    'Database error': 'Error interno del sistema. Inténtalo de nuevo.'
  };
  
  const errorMessage = error.message || 'Error desconocido';
  const userMessage = userFriendlyMessages[errorMessage] || 
                     `Error al procesar la solicitud: ${errorMessage}`;
  
  return {
    type: 'error',
    title: 'Error en el Sistema de Aprobación',
    message: userMessage,
    technical: errorMessage,
    context,
    timestamp: new Date().toISOString(),
    showRetry: !errorMessage.includes('Permission') && !errorMessage.includes('not found')
  };
};

/**
 * Registra acciones de aprobación para auditoría
 * @param {string} action - Acción realizada
 * @param {Object} experience - Experiencia afectada
 * @param {Object} admin - Admin que realizó la acción
 * @returns {Object} - Log de la acción
 */
const logApprovalAction = (action, experience, admin) => {
  const logData = {
    timestamp: new Date().toISOString(),
    action, // 'approved', 'rejected', 'batch_approved', etc.
    experienceId: experience.id,
    experienceTitle: experience.title,
    operatorName: experience.operator_name,
    adminUser: admin?.name || 'Unknown',
    adminId: admin?.id || 'Unknown'
  };
  
  console.log('📋 Approval Action Log:', logData);
  
  // En un sistema real, esto se enviaría a un servicio de logging
  // Por ahora solo loggeamos en consola para debugging
  
  return logData;
};

module.exports = {
  formatApprovalStatus,
  validateAdminPermissions,
  generateApprovalConfirmation,
  generateRejectionConfirmation,
  formatApprovalNotification,
  validateExperienceForApproval,
  extractExperienceSummary,
  generateApprovalStats,
  handleApprovalError,
  logApprovalAction
};
