/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LogCategory = 'PROCESS' | 'API_CALL' | 'AGENT_ACTIVITY' | 'SECURITY_GATE' | 'SYSTEM';
export type LogLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';

export interface ExecutionLogEntry {
  id: string;
  timestamp: string;
  category: LogCategory;
  level: LogLevel;
  source: string;
  action: string;
  details: string;
  latencyMs?: number;
  project?: string;
  metadata?: Record<string, any>;
}

export interface ActiveProcess {
  pid: number;
  name: string;
  command: string;
  cpuPercent: number;
  memoryMb: number;
  status: 'RUNNING' | 'SLEEPING' | 'WAITING' | 'STOPPED';
  startedAt: string;
  assignedCore: string;
}

export interface LogFilterOptions {
  category?: LogCategory | 'ALL';
  level?: LogLevel | 'ALL';
  searchQuery?: string;
  project?: string;
  limit?: number;
}

const MAX_LOGS_CAPACITY = 250;

export class ExecutionLogStore {
  private logs: ExecutionLogEntry[] = [];
  private activeProcesses: ActiveProcess[] = [];

  constructor(initialLogs: ExecutionLogEntry[] = [], initialProcesses: ActiveProcess[] = []) {
    this.logs = [...initialLogs];
    this.activeProcesses = [...initialProcesses];
  }

  public addLog(entry: Omit<ExecutionLogEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): ExecutionLogEntry {
    const newLog: ExecutionLogEntry = {
      id: entry.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      category: entry.category,
      level: entry.level,
      source: entry.source,
      action: entry.action,
      details: entry.details,
      latencyMs: entry.latencyMs,
      project: entry.project,
      metadata: entry.metadata,
    };

    this.logs.unshift(newLog);

    if (this.logs.length > MAX_LOGS_CAPACITY) {
      this.logs = this.logs.slice(0, MAX_LOGS_CAPACITY);
    }

    return newLog;
  }

  public getLogs(options: LogFilterOptions = {}): ExecutionLogEntry[] {
    let result = [...this.logs];

    if (options.category && options.category !== 'ALL') {
      result = result.filter(l => l.category === options.category);
    }

    if (options.level && options.level !== 'ALL') {
      result = result.filter(l => l.level === options.level);
    }

    if (options.project && options.project !== 'ALL') {
      result = result.filter(l => l.project === options.project);
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase();
      result = result.filter(l =>
        l.source.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        (l.project && l.project.toLowerCase().includes(q))
      );
    }

    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  public getActiveProcesses(): ActiveProcess[] {
    return [...this.activeProcesses];
  }

  public updateProcess(pid: number, update: Partial<ActiveProcess>): void {
    const index = this.activeProcesses.findIndex(p => p.pid === pid);
    if (index >= 0) {
      this.activeProcesses[index] = { ...this.activeProcesses[index], ...update };
    }
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public getSummaryMetrics() {
    const total = this.logs.length;
    const processLogs = this.logs.filter(l => l.category === 'PROCESS').length;
    const apiCalls = this.logs.filter(l => l.category === 'API_CALL').length;
    const agentActivities = this.logs.filter(l => l.category === 'AGENT_ACTIVITY').length;
    const errors = this.logs.filter(l => l.level === 'ERROR').length;
    const warnings = this.logs.filter(l => l.level === 'WARN').length;

    return {
      total,
      processLogs,
      apiCalls,
      agentActivities,
      errors,
      warnings,
      activeProcessesCount: this.activeProcesses.filter(p => p.status === 'RUNNING').length,
    };
  }
}

export const INITIAL_EXECUTION_LOGS: ExecutionLogEntry[] = [
  {
    id: 'log-boot-001',
    timestamp: new Date(Date.now() - 320000).toISOString(),
    category: 'SYSTEM',
    level: 'INFO',
    source: 'HOST_KERNEL',
    action: 'KERNEL_INITIALIZATION',
    details: 'JARVIS Kernel v3.5 booting on Windows 11 host (Intel i7-1355U, 15.7 GB RAM)',
    latencyMs: 12,
    project: 'JARVIS'
  },
  {
    id: 'log-proc-002',
    timestamp: new Date(Date.now() - 280000).toISOString(),
    category: 'PROCESS',
    level: 'SUCCESS',
    source: 'OLLAMA_DAEMON',
    action: 'SPAWN_MODEL_PROCESS',
    details: 'Loaded qwen2.5-coder:3b into memory (RAM: 1,950 MB, Quant: Q4_K_M, Device: UHD/CPU)',
    latencyMs: 420,
    project: 'JARVIS'
  },
  {
    id: 'log-agent-003',
    timestamp: new Date(Date.now() - 210000).toISOString(),
    category: 'AGENT_ACTIVITY',
    level: 'INFO',
    source: 'SUPERVISOR_AGENT',
    action: 'ECOSYSTEM_HEALTH_CHECK',
    details: 'Verified project boundaries for ICSN, ENVO, and VERON partitions. Zero cross-leaks detected.',
    latencyMs: 45,
    project: 'GENERAL'
  },
  {
    id: 'log-api-004',
    timestamp: new Date(Date.now() - 150000).toISOString(),
    category: 'API_CALL',
    level: 'SUCCESS',
    source: 'HTTP_DISPATCHER',
    action: 'POST /api/ecosystem/discover',
    details: 'Platform discovery executed for ICSN. 12 tables mapped, RLS active.',
    latencyMs: 38,
    project: 'ICSN'
  },
  {
    id: 'log-sec-005',
    timestamp: new Date(Date.now() - 95000).toISOString(),
    category: 'SECURITY_GATE',
    level: 'WARN',
    source: 'DATABASE_GATEKEEPER',
    action: 'LEVEL_4_ENFORCEMENT',
    details: 'Security gate intercepted destructive DDL attempt. Blocked pending explicit Founder authorization.',
    latencyMs: 8,
    project: 'ICSN'
  },
  {
    id: 'log-agent-006',
    timestamp: new Date(Date.now() - 40000).toISOString(),
    category: 'AGENT_ACTIVITY',
    level: 'SUCCESS',
    source: 'DEVELOPER_SQUAD',
    action: 'TEST_SUITE_EXECUTION',
    details: 'Automated regression test suite executed: 18/18 test suites passed with zero failures.',
    latencyMs: 414,
    project: 'JARVIS'
  }
];

export const INITIAL_ACTIVE_PROCESSES: ActiveProcess[] = [
  {
    pid: 14208,
    name: 'jarvis-kernel-node.exe',
    command: 'node server.ts (Express + Vite Middleware)',
    cpuPercent: 3.2,
    memoryMb: 88,
    status: 'RUNNING',
    startedAt: '09:25:40',
    assignedCore: 'Core 0 (P-Core 5.0 GHz)'
  },
  {
    pid: 8840,
    name: 'ollama.exe',
    command: 'ollama serve (Port 11434)',
    cpuPercent: 1.8,
    memoryMb: 1950,
    status: 'RUNNING',
    startedAt: '09:20:12',
    assignedCore: 'Core 1 (P-Core 5.0 GHz)'
  },
  {
    pid: 19280,
    name: 'jarvis-agent-pool.worker',
    command: 'AgentOrchestrator worker-thread [max=2]',
    cpuPercent: 2.1,
    memoryMb: 42,
    status: 'RUNNING',
    startedAt: '09:25:45',
    assignedCore: 'Core 2 (E-Core)'
  },
  {
    pid: 22104,
    name: 'fastapi-envo.exe',
    command: 'uvicorn main:app --port 8000 (ENVO backend proxy)',
    cpuPercent: 0.6,
    memoryMb: 64,
    status: 'SLEEPING',
    startedAt: '09:21:00',
    assignedCore: 'Core 3 (E-Core)'
  },
  {
    pid: 24512,
    name: 'supabase-pg-pool.client',
    command: 'PostgreSQL connection pooler (ICSN & ENVO)',
    cpuPercent: 0.4,
    memoryMb: 36,
    status: 'WAITING',
    startedAt: '09:22:15',
    assignedCore: 'Core 4 (E-Core)'
  }
];
