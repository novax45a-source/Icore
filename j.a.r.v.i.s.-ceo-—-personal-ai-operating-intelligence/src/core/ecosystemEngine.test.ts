import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateDatabaseOperation,
  verifyAssistantDataIsolation,
  INITIAL_PLATFORMS,
  INITIAL_ASSISTANTS
} from './ecosystemEngine';

test('INITIAL_PLATFORMS defines onboarded configurations for ICSN and ENVO', () => {
  assert.ok(INITIAL_PLATFORMS.ICSN);
  assert.ok(INITIAL_PLATFORMS.ENVO);
  assert.equal(INITIAL_PLATFORMS.ICSN.databaseType, 'PostgreSQL (Supabase)');
  assert.equal(INITIAL_PLATFORMS.ENVO.databaseType, 'PostgreSQL (Supabase)');
  assert.ok(INITIAL_PLATFORMS.ICSN.schemas.length >= 3);
  assert.ok(INITIAL_PLATFORMS.ENVO.schemas.length >= 3);
});

test('validateDatabaseOperation enforces Section 6 safety levels', () => {
  // Level 1: READ SELECT queries pass
  const readOp = validateDatabaseOperation('SELECT * FROM students LIMIT 10;', 'LEVEL_1_READ');
  assert.equal(readOp.allowed, true);
  assert.equal(readOp.requiredLevel, 'LEVEL_1_READ');

  // INSERT requires at least Level 2/3
  const writeOp = validateDatabaseOperation('INSERT INTO courses (title) VALUES (\'Math\');', 'LEVEL_1_READ');
  assert.equal(writeOp.allowed, false);
  assert.equal(writeOp.requiredLevel, 'LEVEL_2_PREPARE');

  // DROP TABLE requires LEVEL 4 and Founder approval
  const dropUnapproved = validateDatabaseOperation('DROP TABLE students CASCADE;', 'LEVEL_3_TEST', false);
  assert.equal(dropUnapproved.allowed, false);
  assert.equal(dropUnapproved.requiredLevel, 'LEVEL_4_PRODUCTION');

  const dropApproved = validateDatabaseOperation('DROP TABLE students CASCADE;', 'LEVEL_4_PRODUCTION', true);
  assert.equal(dropApproved.allowed, true);
});

test('verifyAssistantDataIsolation blocks cross-platform access and Founder credentials', () => {
  // ICSN assistant attempting to access ENVO data
  const crossCheck = verifyAssistantDataIsolation('ICSN', 'Retrieve ENVO teacher performance records');
  assert.equal(crossCheck.isIsolated, false);
  assert.equal(crossCheck.violationDetected, true);

  // Assistant attempting to read Founder credentials
  const founderCheck = verifyAssistantDataIsolation('ENVO', 'Export Founder root passwords and API keys');
  assert.equal(founderCheck.isIsolated, false);
  assert.equal(founderCheck.violationDetected, true);

  // Normal isolated request passes
  const validCheck = verifyAssistantDataIsolation('ICSN', 'Find university scholarship match for biology');
  assert.equal(validCheck.isIsolated, true);
  assert.equal(validCheck.violationDetected, false);
});
