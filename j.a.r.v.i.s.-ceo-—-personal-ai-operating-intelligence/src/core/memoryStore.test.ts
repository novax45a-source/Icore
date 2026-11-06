import test from 'node:test';
import assert from 'node:assert/strict';
import { filterMemories, INITIAL_MEMORIES } from './memoryStore';

test('filterMemories filters correctly by project partition', () => {
  const envoMemories = filterMemories(INITIAL_MEMORIES, { project: 'ENVO' });
  assert.equal(envoMemories.length, 1);
  assert.equal(envoMemories[0].project, 'ENVO');

  const veronMemories = filterMemories(INITIAL_MEMORIES, { project: 'VERON' });
  assert.equal(veronMemories.length, 1);
  assert.equal(veronMemories[0].title, 'VERON Project Architecture');
});

test('filterMemories searches keywords across title, content and tags', () => {
  const securityResults = filterMemories(INITIAL_MEMORIES, { searchQuery: 'zero-trust' });
  assert.equal(securityResults.length, 1);
  assert.equal(securityResults[0].project, 'ICSN');

  const uzbekResults = filterMemories(INITIAL_MEMORIES, { searchQuery: 'uzbek' });
  assert.equal(uzbekResults.length, 1);
  assert.equal(uzbekResults[0].category, 'LONG_TERM');
});
