// Test simple para verificar que ExperienceService funciona
const ExperienceService = require('../../../main/services/ExperienceService');

describe('ExperienceService Basic Tests', () => {
  let experienceService;

  beforeEach(() => {
    experienceService = new ExperienceService();
  });

  test('should create ExperienceService instance', () => {
    expect(experienceService).toBeDefined();
    expect(experienceService.validTypes).toEqual(['cultural', 'historica', 'ecologica']);
  });

  test('should validate required fields correctly', () => {
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

  test('should reject missing required fields', () => {
    const invalidData = {
      title: 'Aventura en Barichara',
      // Missing required fields
    };

    const result = experienceService.validateExperienceData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should calculate total price correctly', () => {
    const experience = { price: 100000 };
    const participants = 3;

    const result = experienceService.calculateTotalPrice(experience, participants);
    expect(result).toBe(300000);
  });

  test('should calculate availability correctly', () => {
    const experience = { id: 1, max_participants: 20 };
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

  test('should build search filters correctly', () => {
    const filters = {
      minPrice: 50000,
      maxPrice: 200000,
      type: 'cultural'
    };

    const result = experienceService.buildSearchFilters(filters);
    expect(result.priceRange).toEqual({ min: 50000, max: 200000 });
    expect(result.type).toBe('cultural');
  });

  test('should validate operator permissions correctly', () => {
    const operatorId = 1;
    const experience = { operator_id: 1 };

    const result = experienceService.validateOperatorPermissions(operatorId, experience);
    expect(result.allowed).toBe(true);
  });

  test('should format experience for response correctly', () => {
    const rawExperience = {
      id: 1,
      title: 'Test Experience',
      description: 'Test description',
      type: 'cultural',
      price: 100000,
      duration_hours: 4,
      max_participants: 10,
      community_id: 1,
      operator_id: 1,
      community_name: 'Test Community',
      community_region: 'Test Region',
      is_active: 1
    };

    const result = experienceService.formatExperienceForResponse(rawExperience);
    expect(result.id).toBe(1);
    expect(result.title).toBe('Test Experience');
    expect(result.duration).toBe(4);
    expect(result.maxParticipants).toBe(10);
    expect(result.community.name).toBe('Test Community');
    expect(result.isActive).toBe(true);
  });
});
