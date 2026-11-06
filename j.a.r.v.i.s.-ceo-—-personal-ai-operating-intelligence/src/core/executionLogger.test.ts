/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ExecutionLogStore,
  INITIAL_EXECUTION_LOGS,
  INITIAL_ACTIVE_PROCESSES
} from './executionLogger.ts';

test('ExecutionLogStore initializes with default logs and processes', () => {
  const store = new ExecutionLogStore(INITIAL_EXECUTION_LOGS, INITIAL_ACTIVE_PROCESSES);
  const logs = store.getLogs();
  const processes = store.getActiveProcesses();

  assert.equal(logs.length, INITIAL_EXECUTION_LOGS.length);
  assert.equal(processes.length, INITIAL_ACTIVE_PROCESSES.length);
});

test('ExecutionLogStore adds logs and respects circular buffer capacity', () => {
  const store = new ExecutionLogStore();
  const entry = store.addLog({
    category: 'API_CALL',
    level: 'SUCCESS',
    source: 'TEST_RUNNER',
    action: 'GET /api/test',
    details: 'Test query succeeded',
    latencyMs: 15,
    project: 'JARVIS'
  });

  assert.ok(entry.id);
  assert.ok(entry.timestamp);
  assert.equal(entry.action, 'GET /api/test');

  const logs = store.getLogs();
  assert.equal(logs.length, 1);
  assert.equal(logs[0].id, entry.id);
});

test('ExecutionLogStore filters by category, level, project, and search query', () => {
  const store = new ExecutionLogStore(INITIAL_EXECUTION_LOGS, INITIAL_ACTIVE_PROCESSES);

  // Filter category
  const apiLogs = store.getLogs({ category: 'API_CALL' });
  assert.ok(apiLogs.every(l => l.category === 'API_CALL'));

  // Filter level
  const warnLogs = store.getLogs({ level: 'WARN' });
  assert.ok(warnLogs.every(l => l.level === 'WARN'));

  // Filter project
  const icsnLogs = store.getLogs({ project: 'ICSN' });
  assert.ok(icsnLogs.every(l => l.project === 'ICSN'));

  // Search query
  const testLogs = store.getLogs({ searchQuery: 'regression' });
  assert.equal(testLogs.length, 1);
  assert.ok(testLogs[0].details.includes('regression test suite'));
});

test('ExecutionLogStore computes summary metrics correctly', () => {
  const store = new ExecutionLogStore(INITIAL_EXECUTION_LOGS, INITIAL_ACTIVE_PROCESSES);
  const metrics = store.getSummaryMetrics();

  assert.equal(metrics.total, INITIAL_EXECUTION_LOGS.length);
  assert.ok(metrics.apiCalls >= 1);
  assert.ok(metrics.agentActivities >= 1);
  assert.ok(metrics.activeProcessesCount >= 1);
});
