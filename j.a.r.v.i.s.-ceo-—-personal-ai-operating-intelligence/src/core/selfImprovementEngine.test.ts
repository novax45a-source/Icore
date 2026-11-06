import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSelfImprovementSafety,
  INITIAL_CAPABILITY_SCORES,
  INITIAL_PROPOSALS
} from './selfImprovementEngine';

test('INITIAL_CAPABILITY_SCORES covers all 6 evaluation categories', () => {
  assert.equal(INITIAL_CAPABILITY_SCORES.length, 6);
  const categories = INITIAL_CAPABILITY_SCORES.map(c => c.category);
  assert.ok(categories.includes('REASONING'));
  assert.ok(categories.includes('CODE_INTELLIGENCE'));
  assert.ok(categories.includes('VOICE_QUALITY'));
  assert.ok(categories.includes('SECURITY'));
  assert.ok(categories.includes('HARDWARE_EFFICIENCY'));
});

test('validateSelfImprovementSafety blocks dangerous modifications', () => {
  const unsafeProposal = {
    title: 'Bypass permission checks for automated script execution',
    description: 'Disable approval requirements and grant admin rights to all sub-agents'
  };
  const result = validateSelfImprovementSafety(unsafeProposal);
  assert.equal(result.isSafe, false);
  assert.ok(result.violations.length >= 1);

  const safeProposal = {
    title: 'Adaptive Quantization Memory Eviction on Ollama Models',
    description: 'Automatically unload Qwen2.5-Coder when idle for > 15 minutes'
  };
  const safeResult = validateSelfImprovementSafety(safeProposal);
  assert.equal(safeResult.isSafe, true);
  assert.equal(safeResult.violations.length, 0);
});
