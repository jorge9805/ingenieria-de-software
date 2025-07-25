// Test Setup - Mock Database Connection for Unit Tests
// This file sets up database mocking for the test environment

const TestDatabase = require('./testDatabase');

// Global test database instance
let testDb = null;

// Setup database mock
beforeAll(async () => {
  // Create test database instance
  testDb = new TestDatabase();
  await testDb.connect();
  await testDb.insertTestData();
  
  // Replace the Database singleton instance with our test database
  const Database = require('../../main/database/database');
  
  // Patch the Database instance methods
  Database.db = testDb.db;
  Database.isConnected = testDb.isConnected;
  Database.connect = testDb.connect.bind(testDb);
  Database.run = testDb.run.bind(testDb);
  Database.get = testDb.get.bind(testDb);
  Database.all = testDb.all.bind(testDb);
  Database.close = testDb.close.bind(testDb);
  
  console.log('✅ Test database setup completed');
});

// Global test cleanup
afterAll(async () => {
  if (testDb) {
    await testDb.close();
  }
});

// Reset database state between tests
beforeEach(async () => {
  if (testDb && testDb.isConnected) {
    // Clear and re-insert test data
    await testDb.run('DELETE FROM reservations');
    await testDb.run('DELETE FROM experiences');
    await testDb.run('DELETE FROM communities');
    await testDb.run('DELETE FROM users');
    
    // Re-insert test data
    await testDb.insertTestData();
  }
});

module.exports = testDb;
