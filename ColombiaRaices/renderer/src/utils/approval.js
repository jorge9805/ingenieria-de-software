// Utilidades para el sistema de aprobación de experiencias
// Funciones helper para mejorar la UX y funcionalidad del sistema de aprobación

/**
 * Formatea el estado de aprobación para mostrar al usuario
 * @param {Object} experience - Experiencia
 * @returns {Object} - Estado formateado
 */
export const formatApprovalStatus = (experience) => {
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
export const validateAdminPermissions = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.userType === 'admin' || userData.role === 'admin';
  } catch (error) {
    console.error('Error validating admin permissions:', error);
    return false;
  }
};

/**
 * Genera un mensaje de confirmación personalizado para aprobación
 * @param {Object} experience - Experiencia a aprobar
 * @returns {string} - Mensaje de confirmación
 */
export const generateApprovalConfirmation = (experience) => {
  return `¿Confirmas la aprobación de esta experiencia?

📋 Título: ${experience.title}
👤 Operador: ${experience.operator_name}
🏘️ Comunidad: ${experience.community_name}
💰 Precio: $${experience.price?.toLocaleString()} COP

Esta experiencia será visible para todos los viajeros.`;
};

/**
 * Genera un mensaje de confirmación personalizado para rechazo
 * @param {Object} experience - Experiencia a rechazar
 * @returns {string} - Mensaje de confirmación
 */
export const generateRejectionConfirmation = (experience) => {
  return `⚠️ ATENCIÓN: ¿Confirmas el RECHAZO de esta experiencia?

📋 Título: ${experience.title}
👤 Operador: ${experience.operator_name}
🏘️ Comunidad: ${experience.community_name}

🚨 ESTA ACCIÓN:
• Eliminará permanentemente la experiencia
• NO se puede deshacer
• El operador deberá volver a crearla

¿Estás seguro de continuar?`;
};

/**
 * Formatea la información de una experiencia para notificaciones
 * @param {Object} experience - Experiencia
 * @param {string} action - Acción realizada ('approved' | 'rejected')
 * @returns {string} - Mensaje de notificación
 */
export const formatApprovalNotification = (experience, action) => {
  const actionText = action === 'approved' ? 'aprobada' : 'rechazada';
  const icon = action === 'approved' ? '✅' : '❌';
  
  return `${icon} Experiencia ${actionText} exitosamente

📋 "${experience.title}"
👤 Operador: ${experience.operator_name}
🏘️ ${experience.community_name}`;
};

/**
 * Valida los datos de una experiencia antes de la aprobación
 * @param {Object} experience - Experiencia a validar
 * @returns {Object} - Resultado de validación
 */
export const validateExperienceForApproval = (experience) => {
  const errors = [];
  
  if (!experience.title || experience.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }
  
  if (!experience.description || experience.description.trim().length < 10) {
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
  
  if (!experience.operator_name) {
    errors.push('Información del operador incompleta');
  }
  
  if (!experience.community_name) {
    errors.push('Información de la comunidad incompleta');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    warnings: []
  };
};

/**
 * Extrae información clave de una experiencia para resumen
 * @param {Object} experience - Experiencia
 * @returns {Object} - Información resumida
 */
export const extractExperienceSummary = (experience) => {
  return {
    id: experience.id,
    title: experience.title,
    operatorName: experience.operator_name,
    operatorEmail: experience.operator_email,
    communityName: experience.community_name,
    communityRegion: experience.community_region,
    price: experience.price,
    duration: experience.duration,
    maxParticipants: experience.maxParticipants,
    type: experience.type,
    createdAt: experience.created_at
  };
};

/**
 * Genera estadísticas de aprobación para el dashboard admin
 * @param {Array} experiences - Lista de experiencias
 * @returns {Object} - Estadísticas
 */
export const generateApprovalStats = (experiences = []) => {
  const stats = {
    total: experiences.length,
    byType: {},
    byCommunity: {},
    byOperator: {},
    averagePrice: 0,
    priceRange: { min: 0, max: 0 }
  };
  
  if (experiences.length === 0) {
    return stats;
  }
  
  let totalPrice = 0;
  let minPrice = experiences[0]?.price || 0;
  let maxPrice = experiences[0]?.price || 0;
  
  experiences.forEach(exp => {
    // Por tipo
    if (exp.type) {
      stats.byType[exp.type] = (stats.byType[exp.type] || 0) + 1;
    }
    
    // Por comunidad
    if (exp.community_name) {
      stats.byCommunity[exp.community_name] = (stats.byCommunity[exp.community_name] || 0) + 1;
    }
    
    // Por operador
    if (exp.operator_name) {
      stats.byOperator[exp.operator_name] = (stats.byOperator[exp.operator_name] || 0) + 1;
    }
    
    // Precios
    if (exp.price) {
      totalPrice += exp.price;
      minPrice = Math.min(minPrice, exp.price);
      maxPrice = Math.max(maxPrice, exp.price);
    }
  });
  
  stats.averagePrice = Math.round(totalPrice / experiences.length);
  stats.priceRange = { min: minPrice, max: maxPrice };
  
  return stats;
};

/**
 * Maneja errores de aprobación de forma consistente
 * @param {Error} error - Error capturado
 * @param {string} action - Acción que falló
 * @returns {string} - Mensaje de error para el usuario
 */
export const handleApprovalError = (error, action = 'procesar') => {
  console.error(`Error al ${action} experiencia:`, error);
  
  let userMessage = `Error al ${action} la experiencia: `;
  
  if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    userMessage += 'No tienes permisos suficientes.';
  } else if (error.message.includes('network') || error.message.includes('connection')) {
    userMessage += 'Error de conexión. Verifica tu conexión a internet.';
  } else if (error.message.includes('not found')) {
    userMessage += 'La experiencia no fue encontrada.';
  } else {
    userMessage += error.message || 'Error desconocido.';
  }
  
  return userMessage;
};

/**
 * Utilidad para logging de acciones de aprobación
 * @param {string} action - Acción realizada
 * @param {Object} experience - Experiencia afectada
 * @param {Object} user - Usuario que realizó la acción
 */
export const logApprovalAction = (action, experience, user = null) => {
  const logData = {
    timestamp: new Date().toISOString(),
    action: action,
    experienceId: experience.id,
    experienceTitle: experience.title,
    operatorName: experience.operator_name,
    adminUser: user?.name || 'Unknown',
    adminId: user?.id || 'Unknown'
  };
  
  console.log('📋 Approval Action Log:', logData);
  
  // En un sistema real, esto se enviaría a un servicio de logging
  // Por ahora solo loggeamos en consola para debugging
  
  return logData;
};
