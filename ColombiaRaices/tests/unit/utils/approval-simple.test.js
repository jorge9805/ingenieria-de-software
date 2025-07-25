// Simple test to verify imports work
const { formatApprovalStatus } = require('../../../renderer/src/utils/approval.cjs');

describe('Simple Import Test', () => {
  test('should import function correctly', () => {
    expect(typeof formatApprovalStatus).toBe('function');
    
    const result = formatApprovalStatus({ is_active: 0 });
    expect(result.status).toBe('pending');
  });
});
