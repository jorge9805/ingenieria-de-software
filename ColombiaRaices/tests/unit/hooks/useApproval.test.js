// Tests para el hook useApproval
// Valida funcionalidad completa del hook de aprobación

// Mock React hooks
const mockUseState = jest.fn();
const mockUseCallback = jest.fn();

// Mock React
jest.mock('react', () => ({
  useState: mockUseState,
  useCallback: mockUseCallback
}));

// Mock window.electronAPI
const mockElectronAPI = {
  experiences: {
    update: jest.fn(),
    delete: jest.fn()
  }
};

global.window = {
  electronAPI: mockElectronAPI,
  confirm: jest.fn(),
  alert: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock console methods
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Mock approval utilities
jest.mock('../../../renderer/src/utils/approval', () => ({
  validateAdminPermissions: jest.fn(),
  generateApprovalConfirmation: jest.fn(),
  generateRejectionConfirmation: jest.fn(),
  formatApprovalNotification: jest.fn(),
  validateExperienceForApproval: jest.fn(),
  handleApprovalError: jest.fn(),
  logApprovalAction: jest.fn()
}));

const {
  validateAdminPermissions,
  generateApprovalConfirmation,
  generateRejectionConfirmation,
  formatApprovalNotification,
  validateExperienceForApproval,
  handleApprovalError,
  logApprovalAction
} = require('../../../renderer/src/utils/approval');

// Mock data
const mockExperience = {
  id: 1,
  title: 'Aventura en Barichara',
  description: 'Una experiencia única',
  operator_name: 'Juan Pérez',
  community_name: 'Barichara',
  price: 150000
};

const mockUserData = {
  id: 1,
  name: 'Admin User',
  userType: 'admin'
};

describe('useApproval Hook', () => {
  let mockSetIsProcessing;
  let mockSetLastAction;
  let useApproval;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup useState mocks
    mockSetIsProcessing = jest.fn();
    mockSetLastAction = jest.fn();
    
    mockUseState
      .mockReturnValueOnce([false, mockSetIsProcessing]) // isProcessing
      .mockReturnValueOnce([null, mockSetLastAction]);   // lastAction

    // Setup useCallback to return the function as-is
    mockUseCallback.mockImplementation((fn) => fn);

    // Setup default mocks
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUserData));
    validateAdminPermissions.mockReturnValue(true);
    validateExperienceForApproval.mockReturnValue({ isValid: true, errors: [] });
    
    // Re-require the hook after mocking
    delete require.cache[require.resolve('../../../renderer/src/hooks/useApproval')];
    useApproval = require('../../../renderer/src/hooks/useApproval').default;
  });

  describe('Hook Initialization', () => {
    test('debe inicializar con estado correcto', () => {
      const hook = useApproval();
      
      expect(mockUseState).toHaveBeenCalledWith(false); // isProcessing
      expect(mockUseState).toHaveBeenCalledWith(null);  // lastAction
      expect(hook.isProcessing).toBe(false);
      expect(hook.lastAction).toBe(null);
    });

    test('debe proporcionar todas las funciones necesarias', () => {
      const hook = useApproval();
      
      expect(typeof hook.approveExperience).toBe('function');
      expect(typeof hook.rejectExperience).toBe('function');
      expect(typeof hook.approveBatch).toBe('function');
      expect(typeof hook.getSessionStats).toBe('function');
      expect(typeof hook.validateAdminPermissions).toBe('function');
      expect(typeof hook.getCurrentUser).toBe('function');
    });
  });

  describe('getCurrentUser', () => {
    test('debe obtener datos del usuario desde localStorage', () => {
      const hook = useApproval();
      const user = hook.getCurrentUser();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userData');
      expect(user).toEqual(mockUserData);
    });

    test('debe manejar localStorage corrupto', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      const hook = useApproval();
      const user = hook.getCurrentUser();
      
      expect(user).toEqual({});
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('approveExperience', () => {
    test('debe validar permisos de admin', async () => {
      validateAdminPermissions.mockReturnValue(false);
      
      const hook = useApproval();
      const result = await hook.approveExperience(mockExperience);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('permisos de administrador');
    });

    test('debe validar datos de experiencia', async () => {
      validateExperienceForApproval.mockReturnValue({
        isValid: false,
        errors: ['Título inválido']
      });
      
      const hook = useApproval();
      const result = await hook.approveExperience(mockExperience);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Experiencia inválida');
    });

    test('debe requerir confirmación del usuario', async () => {
      window.confirm.mockReturnValue(false);
      generateApprovalConfirmation.mockReturnValue('¿Confirmar aprobación?');
      
      const hook = useApproval();
      const result = await hook.approveExperience(mockExperience);
      
      expect(window.confirm).toHaveBeenCalledWith('¿Confirmar aprobación?');
      expect(result.success).toBe(false);
      expect(result.error).toContain('cancelada por el usuario');
    });

    test('debe aprobar experiencia exitosamente', async () => {
      window.confirm.mockReturnValue(true);
      mockElectronAPI.experiences.update.mockResolvedValue({
        success: true,
        message: 'Experience approved'
      });
      formatApprovalNotification.mockReturnValue('✅ Experiencia aprobada');
      
      const onSuccess = jest.fn();
      const hook = useApproval();
      
      const result = await hook.approveExperience(mockExperience, onSuccess);
      
      expect(mockSetIsProcessing).toHaveBeenCalledWith(true);
      expect(mockElectronAPI.experiences.update).toHaveBeenCalledWith({
        experienceId: mockExperience.id,
        updateData: { is_active: 1 },
        operatorId: mockUserData.id,
        isAdmin: true
      });
      expect(logApprovalAction).toHaveBeenCalledWith(
        'APPROVED',
        mockExperience,
        mockUserData
      );
      expect(mockSetLastAction).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('✅ Experiencia aprobada');
      expect(onSuccess).toHaveBeenCalled();
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
      expect(result.success).toBe(true);
    });

    test('debe manejar errores de API', async () => {
      window.confirm.mockReturnValue(true);
      mockElectronAPI.experiences.update.mockResolvedValue({
        success: false,
        error: 'API Error'
      });
      handleApprovalError.mockReturnValue('Error al aprobar: API Error');
      
      const onError = jest.fn();
      const hook = useApproval();
      
      const result = await hook.approveExperience(mockExperience, null, onError);
      
      expect(handleApprovalError).toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Error al aprobar: API Error');
      expect(result.success).toBe(false);
      expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
    });

    test('debe funcionar en modo desarrollo sin ElectronAPI', async () => {
      delete window.electronAPI;
      window.confirm.mockReturnValue(true);
      
      const onSuccess = jest.fn();
      const hook = useApproval();
      
      const result = await hook.approveExperience(mockExperience, onSuccess);
      
      expect(console.warn).toHaveBeenCalledWith(
        'ElectronAPI no disponible, simulando aprobación'
      );
      expect(onSuccess).toHaveBeenCalled();
      expect(result.success).toBe(true);
      
      // Restore for other tests
      window.electronAPI = mockElectronAPI;
    });
  });

  describe('rejectExperience', () => {
    test('debe requerir doble confirmación', async () => {
      window.confirm.mockReturnValueOnce(true).mockReturnValueOnce(false);
      generateRejectionConfirmation.mockReturnValue('¿Confirmar rechazo?');
      
      const hook = useApproval();
      const result = await hook.rejectExperience(mockExperience);
      
      expect(window.confirm).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(false);
      expect(result.error).toContain('cancelado por el usuario');
    });

    test('debe rechazar experiencia exitosamente', async () => {
      window.confirm.mockReturnValue(true);
      mockElectronAPI.experiences.delete.mockResolvedValue({
        success: true,
        message: 'Experience deleted'
      });
      formatApprovalNotification.mockReturnValue('❌ Experiencia rechazada');
      
      const onSuccess = jest.fn();
      const hook = useApproval();
      
      const result = await hook.rejectExperience(mockExperience, onSuccess);
      
      expect(mockElectronAPI.experiences.delete).toHaveBeenCalledWith({
        experienceId: mockExperience.id,
        operatorId: mockUserData.id,
        isAdmin: true
      });
      expect(logApprovalAction).toHaveBeenCalledWith(
        'REJECTED',
        mockExperience,
        mockUserData
      );
      expect(window.alert).toHaveBeenCalledWith('❌ Experiencia rechazada');
      expect(onSuccess).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    test('debe manejar errores de eliminación', async () => {
      window.confirm.mockReturnValue(true);
      mockElectronAPI.experiences.delete.mockRejectedValue(
        new Error('Delete failed')
      );
      handleApprovalError.mockReturnValue('Error al rechazar: Delete failed');
      
      const onError = jest.fn();
      const hook = useApproval();
      
      const result = await hook.rejectExperience(mockExperience, null, onError);
      
      expect(onError).toHaveBeenCalled();
      expect(result.success).toBe(false);
    });
  });

  describe('approveBatch', () => {
    const mockExperiences = [
      { ...mockExperience, id: 1, title: 'Experiencia 1' },
      { ...mockExperience, id: 2, title: 'Experiencia 2' }
    ];

    test('debe validar permisos para aprobación en lote', async () => {
      validateAdminPermissions.mockReturnValue(false);
      
      const hook = useApproval();
      const result = await hook.approveBatch(mockExperiences);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions');
    });

    test('debe requerir confirmación para lote', async () => {
      window.confirm.mockReturnValue(false);
      
      const hook = useApproval();
      const result = await hook.approveBatch(mockExperiences);
      
      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('2 experiencia(s)')
      );
      expect(result.success).toBe(false);
    });

    test('debe procesar lote exitosamente', async () => {
      window.confirm.mockReturnValue(true);
      
      // Mock approveExperience to succeed
      const mockApproveExperience = jest.fn().mockResolvedValue({
        success: true
      });
      
      // Create a new mock that includes the mocked approveExperience
      const mockHook = {
        ...useApproval(),
        approveExperience: mockApproveExperience
      };
      
      const onProgress = jest.fn();
      const onComplete = jest.fn();
      
      const result = await mockHook.approveBatch(
        mockExperiences,
        onProgress,
        onComplete
      );
      
      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onComplete).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.summary.successful).toBe(2);
      expect(result.summary.failed).toBe(0);
    });

    test('debe manejar experiencias vacías', async () => {
      const hook = useApproval();
      const result = await hook.approveBatch([]);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('No experiences to approve');
    });
  });

  describe('getSessionStats', () => {
    test('debe retornar estadísticas de sesión', () => {
      mockUseState
        .mockReturnValueOnce([true, mockSetIsProcessing])  // isProcessing: true
        .mockReturnValueOnce([{ type: 'approval' }, mockSetLastAction]); // lastAction

      const hook = useApproval();
      const stats = hook.getSessionStats();
      
      expect(stats.isProcessing).toBe(true);
      expect(stats.lastAction.type).toBe('approval');
      expect(stats.hasAdminPermissions).toBe(true); // from mock
    });
  });
});

describe('useApproval Hook - Integración', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseState
      .mockReturnValueOnce([false, jest.fn()])
      .mockReturnValueOnce([null, jest.fn()]);
    mockUseCallback.mockImplementation((fn) => fn);
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUserData));
    validateAdminPermissions.mockReturnValue(true);
    validateExperienceForApproval.mockReturnValue({ isValid: true, errors: [] });
    
    delete require.cache[require.resolve('../../../renderer/src/hooks/useApproval')];
  });

  test('debe manejar flujo completo de aprobación', async () => {
    const useApproval = require('../../../renderer/src/hooks/useApproval').default;
    
    // Setup mocks
    window.confirm.mockReturnValue(true);
    mockElectronAPI.experiences.update.mockResolvedValue({ success: true });
    formatApprovalNotification.mockReturnValue('✅ Aprobada');
    
    const hook = useApproval();
    const result = await hook.approveExperience(mockExperience);
    
    // Verificar secuencia completa
    expect(validateAdminPermissions).toHaveBeenCalled();
    expect(validateExperienceForApproval).toHaveBeenCalledWith(mockExperience);
    expect(generateApprovalConfirmation).toHaveBeenCalledWith(mockExperience);
    expect(mockElectronAPI.experiences.update).toHaveBeenCalled();
    expect(logApprovalAction).toHaveBeenCalled();
    expect(formatApprovalNotification).toHaveBeenCalledWith(mockExperience, 'approved');
    expect(result.success).toBe(true);
  });

  test('debe manejar flujo completo de rechazo', async () => {
    const useApproval = require('../../../renderer/src/hooks/useApproval').default;
    
    // Setup mocks
    window.confirm.mockReturnValue(true);
    mockElectronAPI.experiences.delete.mockResolvedValue({ success: true });
    formatApprovalNotification.mockReturnValue('❌ Rechazada');
    
    const hook = useApproval();
    const result = await hook.rejectExperience(mockExperience);
    
    // Verificar secuencia completa
    expect(validateAdminPermissions).toHaveBeenCalled();
    expect(generateRejectionConfirmation).toHaveBeenCalledWith(mockExperience);
    expect(window.confirm).toHaveBeenCalledTimes(2); // Doble confirmación
    expect(mockElectronAPI.experiences.delete).toHaveBeenCalled();
    expect(logApprovalAction).toHaveBeenCalledWith('REJECTED', mockExperience, mockUserData);
    expect(result.success).toBe(true);
  });
});
