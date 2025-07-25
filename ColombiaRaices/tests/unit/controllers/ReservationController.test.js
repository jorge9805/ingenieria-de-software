// ReservationController Test
// Sprint 10 Task 7: Controller and APIs - Testing
// Pruebas para verificar la integración del ReservationController

const ReservationController = require('../../../main/controllers/ReservationController');

describe('ReservationController - Unit Tests', () => {
  let reservationController;

  beforeAll(async () => {
    // Crear instancia del controller
    reservationController = new ReservationController();
  });

  describe('Controller Instantiation', () => {
    test('should create ReservationController instance', () => {
      expect(reservationController).toBeDefined();
      expect(reservationController.reservationService).toBeDefined();
      expect(reservationController.authObserver).toBeDefined();
    });

    test('should have all required methods', () => {
      expect(typeof reservationController.validateReservationData).toBe('function');
      expect(typeof reservationController.validateAvailability).toBe('function');
      expect(typeof reservationController.calculateReservationEstimate).toBe('function');
      expect(typeof reservationController.createReservationEstimate).toBe('function');
      expect(typeof reservationController.confirmReservation).toBe('function');
      expect(typeof reservationController.cancelReservation).toBe('function');
      expect(typeof reservationController.validateCancellation).toBe('function');
      expect(typeof reservationController.completeReservation).toBe('function');
      expect(typeof reservationController.getReservationsByUser).toBe('function');
      expect(typeof reservationController.getReservationDetails).toBe('function');
      expect(typeof reservationController.getReservationsByStatus).toBe('function');
      expect(typeof reservationController.getReservationsByExperience).toBe('function');
      expect(typeof reservationController.getReservationStats).toBe('function');
      expect(typeof reservationController.calculateServicePrice).toBe('function');
      expect(typeof reservationController.calculateAdditionalServices).toBe('function');
    });
  });

  describe('Data Validation Methods', () => {
    test('should validate reservation data and return success structure', async () => {
      const validData = {
        experience_id: 1,
        user_id: 1,
        participants: 2,
        reservation_date: '2025-08-15',
        services: ['guide']
      };

      const result = await reservationController.validateReservationData(validData);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('validation');
      expect(result.success).toBe(true);
      expect(result.validation).toHaveProperty('isValid');
      expect(result.validation).toHaveProperty('errors');
    });

    test('should handle invalid reservation data gracefully', async () => {
      const invalidData = {
        experience_id: 'invalid',
        user_id: null,
        participants: -1,
        reservation_date: 'invalid-date'
      };

      const result = await reservationController.validateReservationData(invalidData);

      expect(result.success).toBe(true);
      expect(result.validation.isValid).toBe(false);
      expect(result.validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Calculation Methods', () => {
    test('should calculate service price and return success structure', async () => {
      const result = await reservationController.calculateServicePrice('guide', 100000);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('serviceType');
      expect(result.success).toBe(true);
      expect(result.price).toBe(20000); // 20% of base price
      expect(result.serviceType).toBe('guide');
    });

    test('should handle invalid service type gracefully', async () => {
      const result = await reservationController.calculateServicePrice('invalid', 100000);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid service type');
      expect(result.price).toBe(0);
    });

    test('should calculate additional services and return success structure', async () => {
      const result = await reservationController.calculateAdditionalServices(
        ['guide', 'transport'],
        100000
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('servicesInfo');
      expect(result.success).toBe(true);
      expect(result.servicesInfo.totalAdditionalCost).toBe(35000); // 20% + 15%
      expect(result.servicesInfo.services).toHaveLength(2);
    });    test('should calculate reservation estimate and return success structure', async () => {
      const reservationData = {
        experience: { id: 1, price: 100000 },
        participants: 2,
        additional_services: ['guide']
      };

      const result = await reservationController.calculateReservationEstimate(reservationData);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('estimate');
      expect(result.success).toBe(true);
      expect(result.estimate.basePrice).toBe(100000);
      expect(result.estimate.participants).toBe(2);
      expect(result.estimate.finalTotal).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing experience gracefully in availability check', async () => {
      const result = await reservationController.validateAvailability(99999, '2025-08-15', 2);

      expect(result.success).toBe(true);
      expect(result.availability.isAvailable).toBe(false);
      expect(result.availability.errors).toContain('Experience not found');
    });

    test('should handle calculation errors gracefully', async () => {
      const invalidData = {
        experience: null,
        participants: 2,
        services: ['guide']
      };

      const result = await reservationController.calculateReservationEstimate(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.estimate).toBe(null);
    });

    test('should handle invalid additional services gracefully', async () => {
      const result = await reservationController.calculateAdditionalServices(
        'invalid',
        100000
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.servicesInfo.totalAdditionalCost).toBe(0);
    });
  });

  describe('Response Structure Validation', () => {
    test('should return consistent response structure for all methods', async () => {
      const methods = [
        'validateReservationData',
        'calculateServicePrice',
        'calculateAdditionalServices',
        'calculateReservationEstimate'
      ];

      for (const method of methods) {
        const result = await reservationController[method]({});
        
        expect(result).toHaveProperty('success');
        expect(typeof result.success).toBe('boolean');
        
        if (!result.success) {
          expect(result).toHaveProperty('error');
          expect(typeof result.error).toBe('string');
        }
      }
    });
  });
});
