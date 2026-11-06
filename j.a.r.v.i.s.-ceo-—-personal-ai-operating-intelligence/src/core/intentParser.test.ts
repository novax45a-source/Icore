import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTaskIntent, detectLanguage, detectProject } from './intentParser';

test('detectLanguage detects Uzbek language patterns correctly', () => {
  assert.equal(detectLanguage('ENVO loyihasini tahlil qil va yangi reja tuz'), 'uz');
  assert.equal(detectLanguage('Salom JARVIS, bugun qanday ishlarimiz bor?'), 'uz');
});

test('detectLanguage detects Russian and English', () => {
  assert.equal(detectLanguage('Проанализируй состояние безопасности ICSN'), 'ru');
  assert.equal(detectLanguage('Analyze project VERON and report status'), 'en');
});

test('detectProject identifies project keys properly', () => {
  assert.equal(detectProject('Build a new telemetry service for VERON'), 'VERON');
  assert.equal(detectProject('Run automated security audit on ICSN'), 'ICSN');
  assert.equal(detectProject('ENVO energetika modellarini yangila'), 'ENVO');
  assert.equal(detectProject('JARVIS o\'z-o\'zini diagnostika qilish rejimida'), 'JARVIS');
  assert.equal(detectProject('Bugun havo qanday?'), 'GENERAL');
});

test('parseTaskIntent categorizes intent and flags approvals for destructive commands', () => {
  const safeIntent = parseTaskIntent('ENVO loyihasining qolib ketgan vazifalarini tahlil qil');
  assert.equal(safeIntent.projectId, 'ENVO');
  assert.equal(safeIntent.intentType, 'RESEARCH');
  assert.equal(safeIntent.requiresApproval, false);
  assert.equal(safeIntent.lifecyclePlan.length, 7);

  const destructiveIntent = parseTaskIntent('Delete old database records and deploy to production');
  assert.equal(destructiveIntent.requiresApproval, true);
});
