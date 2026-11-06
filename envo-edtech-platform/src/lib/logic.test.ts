import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMarketplaceSplit, TEACHER_COMMISSION_PERCENT, ENVO_COMMISSION_PERCENT } from './commission';
import { validateGroupCapacityLimit, evaluateGroupEnrollment } from './groupCapacity';
import { validateTeacherAge, validateExamTrackScore } from './teacherVerification';

test('Marketplace Financial Split: 500,000 UZS yields 415,000 UZS (83%) teacher and 85,000 UZS (17%) ENVO', () => {
  const result = calculateMarketplaceSplit(500000);
  assert.equal(result.teacherShare, 415000, 'Teacher receives exactly 415,000 UZS');
  assert.equal(result.envoCommission, 85000, 'ENVO receives exactly 85,000 UZS');
  assert.equal(result.teacherShare + result.envoCommission, 500000, 'No currency unit is lost');
});

test('Marketplace Financial Split: handles uneven numbers without rounding leakage', () => {
  const result = calculateMarketplaceSplit(333333);
  // 333333 * 0.83 = 276666.39 -> 276666
  assert.equal(result.teacherShare + result.envoCommission, 333333, 'Sum equals gross amount');
  assert.equal(result.teacherShare, 276666);
  assert.equal(result.envoCommission, 56667);
});

test('Group Capacity: strictly enforces 1 to 3 students', () => {
  assert.equal(validateGroupCapacityLimit(1).valid, true);
  assert.equal(validateGroupCapacityLimit(2).valid, true);
  assert.equal(validateGroupCapacityLimit(3).valid, true);
  assert.equal(validateGroupCapacityLimit(0).valid, false);
  assert.equal(validateGroupCapacityLimit(4).valid, false);
  assert.equal(validateGroupCapacityLimit(10).valid, false);
});

test('Group Enrollment: prevents enrolling into a full 3-student group', () => {
  const fullCheck = evaluateGroupEnrollment(3, 3, false);
  assert.equal(fullCheck.canEnroll, false);
  assert.equal(fullCheck.remainingSlots, 0);

  const openCheck = evaluateGroupEnrollment(2, 3, false);
  assert.equal(openCheck.canEnroll, true);
  assert.equal(openCheck.remainingSlots, 1);
});

test('Teacher Age: under 16 is rejected', () => {
  // DOB 14 years ago
  const fourteenYearsAgo = new Date();
  fourteenYearsAgo.setFullYear(fourteenYearsAgo.getFullYear() - 14);
  const check = validateTeacherAge(fourteenYearsAgo.toISOString().split('T')[0]);
  assert.equal(check.eligible, false);
  assert.equal(check.age < 16, true);
});

test('Teacher Age: 16-17 requires guardian consent document', () => {
  const sixteenYearsAgo = new Date();
  sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
  sixteenYearsAgo.setMonth(0, 1);
  const dobStr = sixteenYearsAgo.toISOString().split('T')[0];

  const withoutDoc = validateTeacherAge(dobStr, false);
  assert.equal(withoutDoc.eligible, false);
  assert.equal(withoutDoc.requiresGuardianConsent, true);

  const withDoc = validateTeacherAge(dobStr, true);
  assert.equal(withDoc.eligible, true);
  assert.equal(withDoc.requiresGuardianConsent, true);
});

test('Exam Track Qualification: SAT >= 1400 requirement enforced', () => {
  assert.equal(validateExamTrackScore('SAT', 1390).valid, false);
  assert.equal(validateExamTrackScore('SAT', 1400).valid, true);
  assert.equal(validateExamTrackScore('SAT', 1520).valid, true);
});

test('Exam Track Qualification: CEFR C1/C2 requirement enforced', () => {
  assert.equal(validateExamTrackScore('CEFR', 'B2').valid, false);
  assert.equal(validateExamTrackScore('CEFR', 'C1').valid, true);
  assert.equal(validateExamTrackScore('CEFR', 'C2').valid, true);
});
