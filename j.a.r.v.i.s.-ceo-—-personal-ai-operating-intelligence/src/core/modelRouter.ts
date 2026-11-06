export type AIModelId = 'qwen3:4b' | 'qwen2.5-coder:3b' | 'gemini-2.5-flash';

export interface ModelRoutingContext {
  taskComplexity: 'low' | 'medium' | 'high';
  requiresCode: boolean;
  requiresWebSearch: boolean;
  isOffline: boolean;
  userPreferredModel?: AIModelId | 'auto';
  availableRamGb: number;
}

export interface ModelSelectionResult {
  selectedModel: AIModelId;
  provider: 'Local Ollama' | 'Google Cloud AI';
  rationale: string;
  isFallback: boolean;
}

export function routeOptimalModel(ctx: ModelRoutingContext): ModelSelectionResult {
  // If user explicitly pinned a model and it satisfies basic constraints
  if (ctx.userPreferredModel && ctx.userPreferredModel !== 'auto') {
    if (ctx.userPreferredModel === 'gemini-2.5-flash' && ctx.isOffline) {
      // Offline fallback
      return {
        selectedModel: ctx.requiresCode ? 'qwen2.5-coder:3b' : 'qwen3:4b',
        provider: 'Local Ollama',
        rationale: 'Offline mode active: fallen back from Cloud Gemini to local Qwen engine.',
        isFallback: true
      };
    }

    return {
      selectedModel: ctx.userPreferredModel,
      provider: ctx.userPreferredModel.startsWith('qwen') ? 'Local Ollama' : 'Google Cloud AI',
      rationale: `Selected based on explicit Founder preference (${ctx.userPreferredModel}).`,
      isFallback: false
    };
  }

  // Offline condition: Must use local models
  if (ctx.isOffline) {
    if (ctx.requiresCode) {
      return {
        selectedModel: 'qwen2.5-coder:3b',
        provider: 'Local Ollama',
        rationale: 'Offline code-centric operation routed to local Qwen2.5-Coder.',
        isFallback: false
      };
    }
    return {
      selectedModel: 'qwen3:4b',
      provider: 'Local Ollama',
      rationale: 'Offline general reasoning routed to local Qwen3:4b.',
      isFallback: false
    };
  }

  // Online condition:
  // If high complexity or requires broad internet synthesis or deep research
  if (ctx.taskComplexity === 'high' || ctx.requiresWebSearch) {
    return {
      selectedModel: 'gemini-2.5-flash',
      provider: 'Google Cloud AI',
      rationale: 'High-complexity cross-context analysis routed to cloud-tier Gemini 2.5 Flash.',
      isFallback: false
    };
  }

  // Code tasks with medium/low complexity on local machine
  if (ctx.requiresCode) {
    return {
      selectedModel: 'qwen2.5-coder:3b',
      provider: 'Local Ollama',
      rationale: 'Dedicated programming subtask routed to local Qwen2.5-Coder.',
      isFallback: false
    };
  }

  // Standard conversational / low complexity
  return {
    selectedModel: 'qwen3:4b',
    provider: 'Local Ollama',
    rationale: 'Standard interactive conversation routed to local Qwen3:4b for zero latency.',
    isFallback: false
  };
}
