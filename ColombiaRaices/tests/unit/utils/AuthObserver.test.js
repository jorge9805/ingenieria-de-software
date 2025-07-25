
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const { AuthObserver, AUTH_EVENTS, getAuthObserver } = require('../../../main/utils/AuthObserver');

describe('AuthObserver', () => {
  let authObserver;

  beforeEach(() => {
    authObserver = new AuthObserver();
  });

  afterEach(() => {
    authObserver.clearAll();
  });

  describe('subscribe', () => {
    it('should subscribe to an event successfully', () => {
      const callback = jest.fn();
      const observerId = authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback);
      
      expect(observerId).toBeDefined();
      expect(typeof observerId).toBe('string');
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(1);
    });

    it('should allow multiple observers for same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback1);
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback2);
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(2);
    });

    it('should use custom observer ID when provided', () => {
      const callback = jest.fn();
      const customId = 'custom_observer_id';
      
      const returnedId = authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback, customId);
      
      expect(returnedId).toBe(customId);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from an event successfully', () => {
      const callback = jest.fn();
      const observerId = authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback);
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(1);
      
      authObserver.unsubscribe(AUTH_EVENTS.USER_LOGIN, observerId);
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(0);
    });

    it('should not affect other observers when unsubscribing', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      const id1 = authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback1);
      const id2 = authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback2);
      
      authObserver.unsubscribe(AUTH_EVENTS.USER_LOGIN, id1);
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(1);
    });
  });

  describe('notify', () => {
    it('should notify all subscribers of an event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const testData = { userId: 1, email: 'test@colombia.com' };
      
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback1);
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback2);
      
      authObserver.notify(AUTH_EVENTS.USER_LOGIN, testData);
      
      expect(callback1).toHaveBeenCalledWith(testData);
      expect(callback2).toHaveBeenCalledWith(testData);
    });

    it('should handle errors in observer callbacks gracefully', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Observer error');
      });
      const normalCallback = jest.fn();
      
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, errorCallback);
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, normalCallback);
      
      // Mock console.error to verify error handling
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      authObserver.notify(AUTH_EVENTS.USER_LOGIN, { test: 'data' });
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(normalCallback).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should not crash when notifying non-existent event', () => {
      expect(() => {
        authObserver.notify('non_existent_event', { test: 'data' });
      }).not.toThrow();
    });
  });

  describe('generateObserverId', () => {
    it('should generate unique IDs', () => {
      const id1 = authObserver.generateObserverId();
      const id2 = authObserver.generateObserverId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^observer_/);
      expect(id2).toMatch(/^observer_/);
    });
  });

  describe('getObserverCount', () => {
    it('should return 0 for non-existent event', () => {
      expect(authObserver.getObserverCount('non_existent_event')).toBe(0);
    });

    it('should return correct count for existing event', () => {
      const callback = jest.fn();
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(0);
      
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback);
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(1);
      
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback);
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(2);
    });
  });

  describe('clearAll', () => {
    it('should clear all observers', () => {
      const callback = jest.fn();
      
      authObserver.subscribe(AUTH_EVENTS.USER_LOGIN, callback);
      authObserver.subscribe(AUTH_EVENTS.USER_LOGOUT, callback);
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(1);
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGOUT)).toBe(1);
      
      authObserver.clearAll();
      
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(0);
      expect(authObserver.getObserverCount(AUTH_EVENTS.USER_LOGOUT)).toBe(0);
    });
  });
});

describe('getAuthObserver singleton', () => {
  it('should return the same instance on multiple calls', () => {
    const instance1 = getAuthObserver();
    const instance2 = getAuthObserver();
    
    expect(instance1).toBe(instance2);
  });

  it('should maintain state across calls', () => {
    const instance1 = getAuthObserver();
    const callback = jest.fn();
    
    instance1.subscribe(AUTH_EVENTS.USER_LOGIN, callback);
    
    const instance2 = getAuthObserver();
    expect(instance2.getObserverCount(AUTH_EVENTS.USER_LOGIN)).toBe(1);
  });
});

describe('AUTH_EVENTS', () => {
  it('should contain all expected event types', () => {
    expect(AUTH_EVENTS.USER_LOGIN).toBe('user_login');
    expect(AUTH_EVENTS.USER_LOGOUT).toBe('user_logout');
    expect(AUTH_EVENTS.USER_REGISTER).toBe('user_register');
    expect(AUTH_EVENTS.PASSWORD_CHANGE).toBe('password_change');
    expect(AUTH_EVENTS.LOGIN_ATTEMPT).toBe('login_attempt');
    expect(AUTH_EVENTS.LOGIN_FAILED).toBe('login_failed');
    expect(AUTH_EVENTS.SESSION_EXPIRED).toBe('session_expired');
  });
});
