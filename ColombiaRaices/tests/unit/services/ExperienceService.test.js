// Tests unitarios para ExperienceService - TDD Approach
// Estos tests deben ejecutarse ANTES de implementar el servicio

const ExperienceService = require('../../../main/services/ExperienceService');

describe('ExperienceService', () => {
  let experienceService;

  beforeEach(() => {
    experienceService = new ExperienceService();
  });

  // ============================================
  // 1. TESTS DE VALIDACIÓN DE DATOS
  // ============================================

  describe('validateExperienceData', () => {
    it('should validate required fields correctly', () => {
      const validData = {
        title: 'Aventura en Barichara',
        description: 'Experiencia cultural única',
        type: 'cultural',
        price: 150000,
        duration_hours: 8,
        max_participants: 12,
        community_id: 1,
        operator_id: 1
      };

      const result = experienceService.validateExperienceData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Aventura en Barichara',
        // Missing description, type, price, etc.
      };

      const result = experienceService.validateExperienceData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
      expect(result.errors).toContain('Type is required');
      expect(result.errors).toContain('Price is required');
    });

    it('should reject invalid experience type', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test description',
        type: 'invalid_type',
        price: 100000,
        duration_hours: 4,
        max_participants: 10,
        community_id: 1,
        operator_id: 1
      };

      const result = experienceService.validateExperienceData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Type must be one of: cultural, historica, ecologica');
    });

    it('should reject negative price', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test description',
        type: 'cultural',
        price: -50000,
        duration_hours: 4,
        max_participants: 10,
        community_id: 1,
        operator_id: 1
      };

      const result = experienceService.validateExperienceData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be positive');
    });

    it('should reject invalid duration', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test description',
        type: 'cultural',
        price: 100000,
        duration_hours: 0,
        max_participants: 10,
        community_id: 1,
        operator_id: 1
      };

      const result = experienceService.validateExperienceData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Duration must be at least 1 hour');
    });

    it('should reject invalid max participants', () => {
      const invalidData = {
        title: 'Test',
        description: 'Test description',
        type: 'cultural',
        price: 100000,
        duration_hours: 4,
        max_participants: 0,
        community_id: 1,
        operator_id: 1
      };

      const result = experienceService.validateExperienceData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Max participants must be at least 1');
    });
  });

  // ============================================
  // 2. TESTS DE FILTROS DE BÚSQUEDA
  // ============================================

  describe('buildSearchFilters', () => {
    it('should build filters for price range', () => {
      const filters = {
        minPrice: 50000,
        maxPrice: 200000
      };

      const result = experienceService.buildSearchFilters(filters);
      expect(result.priceRange).toEqual({
        min: 50000,
        max: 200000
      });
    });

    it('should build filters for duration range', () => {
      const filters = {
        minDuration: 2,
        maxDuration: 8
      };

      const result = experienceService.buildSearchFilters(filters);
      expect(result.durationRange).toEqual({
        min: 2,
        max: 8
      });
    });

    it('should build filters for experience type', () => {
      const filters = {
        type: 'cultural'
      };

      const result = experienceService.buildSearchFilters(filters);
      expect(result.type).toBe('cultural');
    });

    it('should build filters for region', () => {
      const filters = {
        region: 'Barichara'
      };

      const result = experienceService.buildSearchFilters(filters);
      expect(result.region).toBe('Barichara');
    });

    it('should build filters for availability date', () => {
      const testDate = '2024-12-25';
      const filters = {
        availableDate: testDate
      };

      const result = experienceService.buildSearchFilters(filters);
      expect(result.availableDate).toBe(testDate);
    });

    it('should handle empty filters', () => {
      const filters = {};

      const result = experienceService.buildSearchFilters(filters);
      expect(result).toEqual({});
    });
  });

  // ============================================
  // 3. TESTS DE CÁLCULOS DE DISPONIBILIDAD
  // ============================================

  describe('calculateAvailability', () => {
    it('should calculate available spots correctly', () => {
      const experience = {
        id: 1,
        max_participants: 20
      };
      const reservedParticipants = 5;
      const requestedParticipants = 8;

      const result = experienceService.calculateAvailability(
        experience,
        reservedParticipants,
        requestedParticipants
      );

      expect(result.available).toBe(true);
      expect(result.availableSpots).toBe(15);
      expect(result.canAccommodate).toBe(true);
    });

    it('should detect when experience is full', () => {
      const experience = {
        id: 1,
        max_participants: 10
      };
      const reservedParticipants = 10;
      const requestedParticipants = 2;

      const result = experienceService.calculateAvailability(
        experience,
        reservedParticipants,
        requestedParticipants
      );

      expect(result.available).toBe(false);
      expect(result.availableSpots).toBe(0);
      expect(result.canAccommodate).toBe(false);
    });

    it('should detect when requested participants exceed available spots', () => {
      const experience = {
        id: 1,
        max_participants: 15
      };
      const reservedParticipants = 10;
      const requestedParticipants = 8;

      const result = experienceService.calculateAvailability(
        experience,
        reservedParticipants,
        requestedParticipants
      );

      expect(result.available).toBe(true);
      expect(result.availableSpots).toBe(5);
      expect(result.canAccommodate).toBe(false);
    });
  });

  // ============================================
  // 4. TESTS DE CÁLCULOS DE PRECIO
  // ============================================

  describe('calculateTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const experience = {
        price: 100000
      };
      const participants = 3;

      const result = experienceService.calculateTotalPrice(experience, participants);
      expect(result).toBe(300000);
    });

    it('should handle single participant', () => {
      const experience = {
        price: 150000
      };
      const participants = 1;

      const result = experienceService.calculateTotalPrice(experience, participants);
      expect(result).toBe(150000);
    });

    it('should handle zero participants', () => {
      const experience = {
        price: 100000
      };
      const participants = 0;

      const result = experienceService.calculateTotalPrice(experience, participants);
      expect(result).toBe(0);
    });
  });

  // ============================================
  // 5. TESTS DE TRANSFORMACIÓN DE DATOS
  // ============================================
  describe('formatExperienceForResponse', () => {
    it('should format experience data correctly', () => {
      const rawExperience = {
        id: 1,
        title: 'Aventura en Barichara',
        description: 'Experiencia cultural única',
        type: 'cultural',
        price: 150000,
        duration_hours: 8,
        max_participants: 12,
        community_id: 1,
        operator_id: 1,
        community_name: 'Barichara',
        community_region: 'Santander',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        is_active: 1,
        image_url: null,
        specific_location: null,
        latitude: null,
        longitude: null
      };

      const result = experienceService.formatExperienceForResponse(rawExperience);

      expect(result).toEqual({
        id: 1,
        title: 'Aventura en Barichara',
        description: 'Experiencia cultural única',
        type: 'cultural',
        price: 150000,
        duration: 8,
        maxParticipants: 12,
        imageUrl: null,
        location: 'Barichara, Santander',
        specificLocation: null,
        latitude: null,
        longitude: null,
        community: {
          id: 1,
          name: 'Barichara',
          region: 'Santander'
        },
        operatorId: 1,
        isActive: true,
        status: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      });
    });
  });

  // ============================================
  // 6. TESTS DE VALIDACIÓN DE OPERADORES
  // ============================================

  describe('validateOperatorPermissions', () => {
    it('should allow operators to manage their own experiences', () => {
      const operatorId = 1;
      const experience = {
        operator_id: 1
      };

      const result = experienceService.validateOperatorPermissions(operatorId, experience);
      expect(result.allowed).toBe(true);
    });

    it('should deny operators from managing other experiences', () => {
      const operatorId = 1;
      const experience = {
        operator_id: 2
      };

      const result = experienceService.validateOperatorPermissions(operatorId, experience);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Operator can only manage own experiences');
    });

    it('should allow admin users to manage any experience', () => {
      const operatorId = 1;
      const experience = {
        operator_id: 2
      };
      const isAdmin = true;

      const result = experienceService.validateOperatorPermissions(operatorId, experience, isAdmin);
      expect(result.allowed).toBe(true);
    });
  });
});
