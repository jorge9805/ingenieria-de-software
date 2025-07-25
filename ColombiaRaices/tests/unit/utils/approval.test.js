// Tests para el sistema de aprobación de experiencias
// Valida funcionalidad completa del workflow de aprobación

// Importar utilidades de aprobación
const {
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
} = require('../../../renderer/src/utils/approval.cjs');

// Mock data para testing
const mockExperience = {
  id: 1,
  title: 'Aventura en Barichara',
  description: 'Una experiencia única en el pueblo más hermoso de Colombia',
  type: 'cultural',
  price: 150000,
  duration: 4,
  maxParticipants: 10,
  operator_name: 'Juan Pérez',
  operator_email: 'juan@email.com',
  community_name: 'Barichara',
  community_region: 'Santander',
  is_active: 0,
  created_at: '2025-07-19T10:00:00Z'
};

const mockExperiences = [
  mockExperience,
  {
    id: 2,
    title: 'Caminata Cocora',
    description: 'Caminata por el valle de Cocora',
    type: 'natural',
    price: 80000,
    duration: 6,
    maxParticipants: 15,
    operator_name: 'María García',
    operator_email: 'maria@email.com',
    community_name: 'Salento',
    community_region: 'Quindío',
    is_active: 0,
    created_at: '2025-07-19T11:00:00Z'
  }
];

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('Sistema de Aprobación de Experiencias - Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  describe('formatApprovalStatus', () => {
    test('debe formatear experiencia pendiente correctamente', () => {
      const experience = { is_active: 0 };
      const result = formatApprovalStatus(experience);
      
      expect(result.status).toBe('pending');
      expect(result.label).toBe('Pendiente');
      expect(result.color).toBe('#ffc107');
      expect(result.icon).toBe('⏳');
    });

    test('debe formatear experiencia aprobada correctamente', () => {
      const experience = { is_active: 1 };
      const result = formatApprovalStatus(experience);
      
      expect(result.status).toBe('approved');
      expect(result.label).toBe('Aprobada');
      expect(result.color).toBe('#28a745');
      expect(result.icon).toBe('✅');
    });
  });

  describe('validateAdminPermissions', () => {
    test('debe validar permisos de admin correctamente', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ 
        userType: 'admin' 
      }));
      
      const result = validateAdminPermissions();
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userData');
    });

    test('debe rechazar permisos de no-admin', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ 
        userType: 'viajero' 
      }));
      
      const result = validateAdminPermissions();
      expect(result).toBe(false);
    });

    test('debe manejar errores en localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      const result = validateAdminPermissions();
      expect(result).toBe(false);
    });
  });

  describe('generateApprovalConfirmation', () => {
    test('debe generar mensaje de confirmación para aprobación', () => {
      const result = generateApprovalConfirmation(mockExperience);
      
      expect(result).toContain('¿Confirmas la aprobación');
      expect(result).toContain(mockExperience.title);
      expect(result).toContain(mockExperience.operator_name);
      expect(result).toContain(mockExperience.community_name);
      expect(result).toContain('$150,000');
    });
  });

  describe('generateRejectionConfirmation', () => {
    test('debe generar mensaje de confirmación para rechazo', () => {
      const result = generateRejectionConfirmation(mockExperience);
      
      expect(result).toContain('RECHAZO');
      expect(result).toContain(mockExperience.title);
      expect(result).toContain('NO se puede deshacer');
      expect(result).toContain('¿Estás seguro de continuar?');
    });
  });

  describe('formatApprovalNotification', () => {
    test('debe formatear notificación de aprobación', () => {
      const result = formatApprovalNotification(mockExperience, 'approved');
      
      expect(result).toContain('✅');
      expect(result).toContain('aprobada exitosamente');
      expect(result).toContain(mockExperience.title);
      expect(result).toContain(mockExperience.operator_name);
    });

    test('debe formatear notificación de rechazo', () => {
      const result = formatApprovalNotification(mockExperience, 'rejected');
      
      expect(result).toContain('❌');
      expect(result).toContain('rechazada exitosamente');
      expect(result).toContain(mockExperience.title);
    });
  });

  describe('validateExperienceForApproval', () => {
    test('debe validar experiencia completa correctamente', () => {
      const result = validateExperienceForApproval(mockExperience);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('debe detectar título faltante', () => {
      const invalidExperience = { ...mockExperience, title: '' };
      const result = validateExperienceForApproval(invalidExperience);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El título debe tener al menos 3 caracteres');
    });

    test('debe detectar descripción corta', () => {
      const invalidExperience = { ...mockExperience, description: 'Corta' };
      const result = validateExperienceForApproval(invalidExperience);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La descripción debe tener al menos 10 caracteres');
    });

    test('debe detectar precio inválido', () => {
      const invalidExperience = { ...mockExperience, price: 0 };
      const result = validateExperienceForApproval(invalidExperience);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El precio debe ser mayor a 0');
    });

    test('debe detectar múltiples errores', () => {
      const invalidExperience = {
        ...mockExperience,
        title: '',
        price: -100,
        duration: 0
      };
      const result = validateExperienceForApproval(invalidExperience);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('extractExperienceSummary', () => {
    test('debe extraer información clave de la experiencia', () => {
      const result = extractExperienceSummary(mockExperience);
        expect(result.id).toBe(mockExperience.id);
      expect(result.title).toBe(mockExperience.title);
      expect(result.operator).toBe(mockExperience.operator_name);
      expect(result.community).toBe(mockExperience.community_name);
      expect(result.price).toBe(mockExperience.price);
    });
  });

  describe('generateApprovalStats', () => {
    test('debe generar estadísticas correctas', () => {
      const result = generateApprovalStats(mockExperiences);
        expect(result.total).toBe(2);
      expect(result.byType.cultural).toBe(1);
      expect(result.byType.natural).toBe(1);
      expect(result.byRegion.Santander).toBe(1);
      expect(result.byRegion.Quindío).toBe(1);      expect(result.avgPrice).toBe(115000); // (150000 + 80000) / 2
    });

    test('debe manejar array vacío', () => {
      const result = generateApprovalStats([]);
        expect(result.total).toBe(0);
      expect(result.byType).toEqual({});
      expect(result.avgPrice).toBe(0);
    });

    test('debe contar operadores únicos', () => {
      const result = generateApprovalStats(mockExperiences);
      
      expect(result.byOperator['Juan Pérez']).toBe(1);
      expect(result.byOperator['María García']).toBe(1);
      expect(Object.keys(result.byOperator)).toHaveLength(2);
    });
  });

  describe('handleApprovalError', () => {
    test('debe manejar error de permisos', () => {
      const error = new Error('permission denied');      const result = handleApprovalError(error, 'aprobar');
      
      expect(result.type).toBe('error');
      expect(result.message).toContain('Error al procesar la solicitud');
    });

    test('debe manejar error de conexión', () => {
      const error = new Error('network connection failed');      const result = handleApprovalError(error, 'aprobar');
      
      expect(result.type).toBe('error');
      expect(result.message).toContain('Error al procesar la solicitud');
    });

    test('debe manejar error genérico', () => {
      const error = new Error('algo salió mal');      const result = handleApprovalError(error, 'rechazar');
      
      expect(result.type).toBe('error');
      expect(result.message).toContain('Error al procesar la solicitud');
      expect(result.technical).toContain('algo salió mal');
    });
  });

  describe('logApprovalAction', () => {
    // Mock console.log para capturar logs
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    afterEach(() => {
      consoleSpy.mockClear();
    });

    test('debe loggear acción de aprobación', () => {
      const user = { id: 1, name: 'Admin User' };
      const result = logApprovalAction('APPROVED', mockExperience, user);
      
      expect(result.action).toBe('APPROVED');
      expect(result.experienceId).toBe(mockExperience.id);
      expect(result.experienceTitle).toBe(mockExperience.title);
      expect(result.adminUser).toBe(user.name);
      expect(result.adminId).toBe(user.id);
      expect(result.timestamp).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith('📋 Approval Action Log:', result);
    });

    test('debe manejar usuario no definido', () => {
      const result = logApprovalAction('REJECTED', mockExperience);
      
      expect(result.adminUser).toBe('Unknown');
      expect(result.adminId).toBe('Unknown');
    });
  });
});

describe('Sistema de Aprobación de Experiencias - Integración', () => {
  describe('Flujo completo de aprobación', () => {
    test('debe validar experiencia antes de aprobación', () => {
      // 1. Validar experiencia
      const validation = validateExperienceForApproval(mockExperience);
      expect(validation.isValid).toBe(true);
      
      // 2. Generar confirmación
      const confirmation = generateApprovalConfirmation(mockExperience);
      expect(confirmation).toContain('¿Confirmas la aprobación');
      
      // 3. Generar notificación
      const notification = formatApprovalNotification(mockExperience, 'approved');
      expect(notification).toContain('aprobada exitosamente');
      
      // 4. Extraer resumen
      const summary = extractExperienceSummary(mockExperience);
      expect(summary.id).toBe(mockExperience.id);
    });

    test('debe manejar flujo de rechazo completo', () => {
      // 1. Validar permisos
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ 
        userType: 'admin' 
      }));
      const hasPermissions = validateAdminPermissions();
      expect(hasPermissions).toBe(true);
      
      // 2. Generar confirmación de rechazo
      const confirmation = generateRejectionConfirmation(mockExperience);
      expect(confirmation).toContain('RECHAZO');
      
      // 3. Loggear acción
      const user = { id: 1, name: 'Admin' };
      const logEntry = logApprovalAction('REJECTED', mockExperience, user);
      expect(logEntry.action).toBe('REJECTED');
    });
  });

  describe('Estadísticas y análisis', () => {
    test('debe generar estadísticas completas para dashboard', () => {
      const stats = generateApprovalStats(mockExperiences);
        // Verificar completitud de estadísticas
      expect(stats.total).toBeGreaterThan(0);
      expect(Object.keys(stats.byType)).toHaveLength(2);
      expect(Object.keys(stats.byRegion)).toHaveLength(2);
      expect(Object.keys(stats.byOperator)).toHaveLength(2);
      expect(stats.avgPrice).toBeGreaterThan(0);
    });

    test('debe formatear estado de aprobación para UI', () => {
      const pendingStatus = formatApprovalStatus({ is_active: 0 });
      const approvedStatus = formatApprovalStatus({ is_active: 1 });
      
      expect(pendingStatus.status).toBe('pending');
      expect(approvedStatus.status).toBe('approved');
      expect(pendingStatus.icon).toBe('⏳');
      expect(approvedStatus.icon).toBe('✅');
    });
  });

  describe('Manejo de errores', () => {
    test('debe manejar datos inválidos gracefully', () => {
      const invalidExperience = {
        // Datos incompletos
        id: null,
        title: '',
        price: -100
      };
      
      const validation = validateExperienceForApproval(invalidExperience);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('debe manejar localStorage corrupto', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const hasPermissions = validateAdminPermissions();
      expect(hasPermissions).toBe(false);
    });
  });
});

describe('Sistema de Aprobación de Experiencias - Performance', () => {
  test('debe procesar estadísticas de muchas experiencias eficientemente', () => {    // Generar dataset grande
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      ...mockExperience,
      id: i + 1,
      type: ['cultural', 'natural', 'aventura'][i % 3],
      operator_name: `Operador ${(i % 50) + 1}`,
      community_name: `Comunidad ${(i % 20) + 1}`,
      community_region: `Región ${(i % 20) + 1}`,
      price: 50000 + (i * 1000)
    }));
    
    const startTime = Date.now();
    const stats = generateApprovalStats(largeDataset);
    const endTime = Date.now();
    
    // Verificar que el procesamiento sea rápido (< 100ms)
    expect(endTime - startTime).toBeLessThan(100);
      // Verificar resultados
    expect(stats.total).toBe(1000);
    expect(Object.keys(stats.byType)).toHaveLength(3);
    expect(Object.keys(stats.byOperator)).toHaveLength(50);
    expect(Object.keys(stats.byRegion)).toHaveLength(20);
  });

  test('debe validar experiencias rápidamente', () => {
    const startTime = Date.now();
    
    // Validar múltiples experiencias
    for (let i = 0; i < 100; i++) {
      validateExperienceForApproval(mockExperience);
    }
    
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(50);
  });
});
