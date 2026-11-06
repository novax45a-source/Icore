export type MemoryCategory = 'SHORT_TERM' | 'LONG_TERM' | 'PROJECT' | 'KNOWLEDGE_BASE';

export interface MemoryEntry {
  id: string;
  category: MemoryCategory;
  project?: 'VERON' | 'ICSN' | 'ENVO' | 'JARVIS';
  title: string;
  content: string;
  tags: string[];
  confidence: number; // 0.0 to 1.0
  source: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_MEMORIES: MemoryEntry[] = [
  {
    id: 'mem-founder-1',
    category: 'LONG_TERM',
    title: 'Founder Language & Protocol',
    content: 'Founder default language is Uzbek. Prefers concise, highly technical, action-oriented briefings. Iron Man Stark Industries style.',
    tags: ['founder', 'preferences', 'language', 'uzbek'],
    confidence: 0.99,
    source: 'Founder Profile Directive',
    createdAt: '2026-11-05T00:00:00Z',
    updatedAt: '2026-11-05T00:00:00Z'
  },
  {
    id: 'mem-veron-1',
    category: 'PROJECT',
    project: 'VERON',
    title: 'VERON Project Architecture',
    content: 'Smart hardware & logistics infrastructure automation. Focus on high-throughput sensor telemetry, distributed control nodes, and real-time dispatch.',
    tags: ['veron', 'architecture', 'hardware', 'logistics'],
    confidence: 0.95,
    source: 'VERON System Specification',
    createdAt: '2026-11-05T01:00:00Z',
    updatedAt: '2026-11-05T01:00:00Z'
  },
  {
    id: 'mem-icsn-1',
    category: 'PROJECT',
    project: 'ICSN',
    title: 'ICSN Security Standards',
    content: 'Information & Cyber Security Network. Zero-trust architecture, automated port auditing, cryptographically signed agent messages, and firewall guardrails.',
    tags: ['icsn', 'security', 'zero-trust', 'firewall'],
    confidence: 0.97,
    source: 'ICSN Security Whitepaper',
    createdAt: '2026-11-05T01:30:00Z',
    updatedAt: '2026-11-05T01:30:00Z'
  },
  {
    id: 'mem-envo-1',
    category: 'PROJECT',
    project: 'ENVO',
    title: 'ENVO Environmental Optimization Engine',
    content: 'Renewable energy consumption optimization, carbon footprint tracking algorithms, and green microgrid telemetry integration.',
    tags: ['envo', 'clean-energy', 'optimization', 'sustainability'],
    confidence: 0.94,
    source: 'ENVO Energy Charter',
    createdAt: '2026-11-05T02:00:00Z',
    updatedAt: '2026-11-05T02:00:00Z'
  },
  {
    id: 'mem-jarvis-1',
    category: 'PROJECT',
    project: 'JARVIS',
    title: 'JARVIS Kernel Resource Guardrails',
    content: 'Strict allocation on Intel i7-1355U: max 2 heavy concurrent agent processes. Keep memory footprint below 3.5GB for local inference.',
    tags: ['jarvis', 'kernel', 'hardware', 'ollama', 'intel-i7'],
    confidence: 0.99,
    source: 'Master Development Directive',
    createdAt: '2026-11-05T02:30:00Z',
    updatedAt: '2026-11-05T02:30:00Z'
  }
];

export function filterMemories(
  memories: MemoryEntry[],
  options: {
    category?: MemoryCategory;
    project?: string;
    searchQuery?: string;
  }
): MemoryEntry[] {
  return memories.filter(entry => {
    if (options.category && entry.category !== options.category) {
      return false;
    }
    if (options.project && options.project !== 'ALL' && entry.project !== options.project) {
      return false;
    }
    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchContent = entry.content.toLowerCase().includes(q);
      const matchTags = entry.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) {
        return false;
      }
    }
    return true;
  });
}
