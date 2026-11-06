import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateUniversityMatch, rankUniversitiesForStudent } from './matchingEngine';
import { UNIVERSITIES_DATA } from '../data/universitiesData';

test('evaluateUniversityMatch identifies Strong Profile Match for high-achieving student', () => {
  const tumUni = UNIVERSITIES_DATA.find((u) => u.id === 'uni_tum')!;
  assert.ok(tumUni);

  const studentProfile = {
    gpa: 3.8,
    ieltsScore: 7.5,
    toeflScore: 105,
    targetBudgetUsd: 10000,
    targetCountries: ['Germany'],
    interests: ['field_cs_ai', 'field_eng_mech'],
  };

  const match = evaluateUniversityMatch(tumUni, studentProfile);

  assert.equal(match.fitCategory, 'Strong Profile Match');
  assert.ok(match.fitScore >= 80);
  assert.ok(match.matchReasons.length >= 3);
  assert.equal(match.missingQualifications.length, 0);
});

test('evaluateUniversityMatch detects missing language qualifications', () => {
  const oxfordUni = UNIVERSITIES_DATA.find((u) => u.id === 'uni_oxford')!;
  assert.ok(oxfordUni);

  const studentProfile = {
    gpa: 3.9,
    ieltsScore: 6.0, // Oxford requires 7.5
    toeflScore: 80,
    targetBudgetUsd: 50000,
    targetCountries: ['United Kingdom'],
  };

  const match = evaluateUniversityMatch(oxfordUni, studentProfile);

  assert.ok(match.missingQualifications.some((m) => m.toLowerCase().includes('language')));
});

test('rankUniversitiesForStudent sorts universities by fitScore descending', () => {
  const studentProfile = {
    gpa: 3.7,
    ieltsScore: 7.0,
    targetBudgetUsd: 5000,
    targetCountries: ['South Korea', 'Germany'],
  };

  const matches = rankUniversitiesForStudent(UNIVERSITIES_DATA, studentProfile);
  assert.equal(matches.length, UNIVERSITIES_DATA.length);

  for (let i = 0; i < matches.length - 1; i++) {
    assert.ok(matches[i].fitScore >= matches[i + 1].fitScore);
  }
});
