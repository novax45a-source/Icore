import test from 'node:test';
import assert from 'node:assert/strict';
import { planAgentSquad, REGISTERED_AGENTS } from './agentOrchestrator';

test('REGISTERED_AGENTS has all 13 specialized agents defined', () => {
  const roles = Object.keys(REGISTERED_AGENTS);
  assert.equal(roles.length, 13);
  assert.ok(REGISTERED_AGENTS.SUPERVISOR);
  assert.ok(REGISTERED_AGENTS.RESEARCH);
  assert.ok(REGISTERED_AGENTS.DEVELOPER);
  assert.ok(REGISTERED_AGENTS.DATABASE);
  assert.ok(REGISTERED_AGENTS.ECOSYSTEM);
  assert.ok(REGISTERED_AGENTS.DEPLOYMENT);
  assert.ok(REGISTERED_AGENTS.SECURITY);
});

test('planAgentSquad assigns Developer squad for coding tasks with resource limit', () => {
  const squad = planAgentSquad('Refactor the backend and write automated tests');
  assert.equal(squad.leadAgent, 'DEVELOPER');
  assert.ok(squad.supportingAgents.includes('TESTING'));
  assert.ok(squad.supportingAgents.includes('SUPERVISOR'));
  assert.equal(squad.maxConcurrency, 2);
});

test('planAgentSquad assigns Research squad for investigative queries', () => {
  const squad = planAgentSquad('Research latest clean energy venture models for ENVO');
  assert.equal(squad.leadAgent, 'RESEARCH');
  assert.ok(squad.supportingAgents.includes('ANALYST'));
  assert.ok(squad.supportingAgents.includes('SUPERVISOR'));
  assert.ok(squad.estimatedMemoryFootprintMb <= 2500);
});

test('planAgentSquad assigns Database and Ecosystem squads for relevant operations', () => {
  const dbSquad = planAgentSquad('Inspect the Supabase PostgreSQL schema and prepare migration');
  assert.equal(dbSquad.leadAgent, 'DATABASE');
  assert.ok(dbSquad.supportingAgents.includes('SECURITY'));

  const ecoSquad = planAgentSquad('Run platform discovery and onboard ICSN platform repository');
  assert.equal(ecoSquad.leadAgent, 'ECOSYSTEM');
  assert.ok(ecoSquad.supportingAgents.includes('DEVELOPER'));
});
