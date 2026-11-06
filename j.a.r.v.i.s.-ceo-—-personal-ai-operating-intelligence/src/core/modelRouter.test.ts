import test from 'node:test';
import assert from 'node:assert/strict';
import { routeOptimalModel } from './modelRouter';

test('routeOptimalModel selects qwen2.5-coder:3b for coding tasks', () => {
  const result = routeOptimalModel({
    taskComplexity: 'medium',
    requiresCode: true,
    requiresWebSearch: false,
    isOffline: false,
    availableRamGb: 11.2
  });
  assert.equal(result.selectedModel, 'qwen2.5-coder:3b');
  assert.equal(result.provider, 'Local Ollama');
});

test('routeOptimalModel selects gemini-2.5-flash for high complexity tasks', () => {
  const result = routeOptimalModel({
    taskComplexity: 'high',
    requiresCode: false,
    requiresWebSearch: true,
    isOffline: false,
    availableRamGb: 10.5
  });
  assert.equal(result.selectedModel, 'gemini-2.5-flash');
  assert.equal(result.provider, 'Google Cloud AI');
});

test('routeOptimalModel falls back to local Qwen when offline even if Cloud requested', () => {
  const result = routeOptimalModel({
    taskComplexity: 'high',
    requiresCode: false,
    requiresWebSearch: false,
    isOffline: true,
    userPreferredModel: 'gemini-2.5-flash',
    availableRamGb: 9.8
  });
  assert.equal(result.selectedModel, 'qwen3:4b');
  assert.equal(result.isFallback, true);
  assert.equal(result.provider, 'Local Ollama');
});
