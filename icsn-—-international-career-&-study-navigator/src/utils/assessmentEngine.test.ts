import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAssessmentResult, ACADEMIC_FIELD_DEFINITIONS } from './assessmentEngine';
import { ASSESSMENT_QUESTIONS } from '../data/assessmentQuestions';

test('ASSESSMENT_QUESTIONS contains exactly 30 questions', () => {
  assert.equal(ASSESSMENT_QUESTIONS.length, 30);
  // Ensure every question has 4 options and valid tags
  for (const q of ASSESSMENT_QUESTIONS) {
    assert.ok(q.id >= 1 && q.id <= 30);
    assert.equal(q.options.length, 4);
    assert.ok(q.question.length > 10);
    assert.ok(q.questionUz.length > 5);
    assert.ok(q.questionRu.length > 5);
  }
});

test('calculateAssessmentResult accurately scores tech-focused responses', () => {
  // All option 0 choices lean tech/engineering in our dataset
  const techAnswers: Record<number, number> = {};
  for (let i = 1; i <= 30; i++) {
    techAnswers[i] = 0;
  }

  const result = calculateAssessmentResult(techAnswers);

  assert.ok(result.topFields.length >= 2);
  // Tech field should be the top match
  assert.equal(result.topFields[0].fieldId, 'cs_ai');
  assert.ok(result.topFields[0].matchPercent >= 90);
  assert.ok(result.recommendedMajors.length >= 3);
  assert.ok(result.recommendedMajors.some((m) => m.toLowerCase().includes('intelligence') || m.toLowerCase().includes('computer')));
  assert.ok(result.careerDirections.length >= 3);
  assert.ok(result.recommendedDestinations.length >= 1);
});

test('calculateAssessmentResult handles business/economics responses', () => {
  // Option 1 choices lean business/economics
  const businessAnswers: Record<number, number> = {};
  for (let i = 1; i <= 30; i++) {
    businessAnswers[i] = 1;
  }

  const result = calculateAssessmentResult(businessAnswers);

  assert.equal(result.topFields[0].fieldId, 'business_finance');
  assert.ok(result.topFields[0].matchPercent >= 85);
  assert.ok(result.recommendedMajors.some((m) => m.includes('Business') || m.includes('Economics') || m.includes('Finance')));
});

test('calculateAssessmentResult produces stable results with partial answers', () => {
  const partialAnswers: Record<number, number> = {
    1: 2,
    2: 1,
    3: 2,
  };

  const result = calculateAssessmentResult(partialAnswers);
  assert.ok(result.topFields.length > 0);
  assert.ok(result.answersImpactSummary.length > 20);
});
