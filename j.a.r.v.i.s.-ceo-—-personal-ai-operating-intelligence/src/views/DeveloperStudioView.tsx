import React, { useState } from 'react';
import {
  Terminal,
  FolderTree,
  FileCode,
  Play,
  RotateCcw,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Cpu
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  language?: string;
  content?: string;
}

const SAMPLE_PROJECT_TREE: FileNode = {
  name: 'jarvis-kernel',
  type: 'folder',
  path: 'C:\\Users\\acer\\jarvis-project\\jarvis-kernel',
  children: [
    {
      name: 'core',
      type: 'folder',
      path: 'core',
      children: [
        {
          name: 'kernel.py',
          type: 'file',
          path: 'core/kernel.py',
          language: 'python',
          content: `"""
JARVIS Autonomous Intelligence Kernel (Iron Core v3.5)
Target Host: Windows 11 | Intel i7-1355U | 15.7GB RAM
"""
import asyncio
import logging
from typing import Dict, Any

class JarvisKernel:
    def __init__(self, ollama_endpoint: str = "http://localhost:11434"):
        self.ollama_endpoint = ollama_endpoint
        self.active_models = ["qwen3:4b", "qwen2.5-coder:3b"]
        self.max_threads = 2
        logging.info("[JARVIS] Kernel initialized on Intel i7-1355U.")

    async def execute_task(self, prompt: str, project: str) -> Dict[str, Any]:
        print(f"[JARVIS] Executing mission for project {project}: {prompt}")
        # Structured lifecycle: RECEIVE -> UNDERSTAND -> PLAN -> EXECUTE -> REPORT
        return {"status": "SUCCESS", "verified": True}
`
        },
        {
          name: 'model_router.py',
          type: 'file',
          path: 'core/model_router.py',
          language: 'python',
          content: `"""
Dynamic Multi-Model Router
Directs tasks to Qwen2.5-Coder:3b, Qwen3:4b, or Cloud Gemini.
"""
def route_model(task_type: str, has_code: bool) -> str:
    if has_code:
        return "qwen2.5-coder:3b"
    return "qwen3:4b"
`
        }
      ]
    },
    {
      name: 'projects',
      type: 'folder',
      path: 'projects',
      children: [
        {
          name: 'envo_specs.json',
          type: 'file',
          path: 'projects/envo_specs.json',
          language: 'json',
          content: `{\n  "project": "ENVO",\n  "status": "active",\n  "version": "2.4",\n  "initiatives": [\n    "clean_energy_microgrid",\n    "carbon_reduction_telemetry"\n  ]\n}`
        },
        {
          name: 'icsn_security.py',
          type: 'file',
          path: 'projects/icsn_security.py',
          language: 'python',
          content: `"""\nICSN Security Protocol Validator\n"""\ndef verify_zero_trust():\n    return {"firewall": "ACTIVE", "encrypted": True}\n`
        }
      ]
    },
    {
      name: 'config.yaml',
      type: 'file',
      path: 'config.yaml',
      language: 'yaml',
      content: `host: "C:\\\\Users\\\\acer\\\\jarvis-project\\\\jarvis-kernel"\nollama_host: "http://localhost:11434"\nlanguage_default: "uz"\nfounder_email: "princess0481128@gmail.com"\n`
    }
  ]
};

export const DeveloperStudioView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode>(
    SAMPLE_PROJECT_TREE.children![0].children![0]
  );
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'JARVIS Developer Terminal [Version 3.5.0-Stark]',
    'Host environment: C:\\Users\\acer\\jarvis-project\\jarvis-kernel',
    'Ollama models: qwen2.5-coder:3b (Loaded), qwen3:4b (Standby)',
    'Ready. Type "help", "git status", "npm test", "ollama list", or "python core/kernel.py"'
  ]);
  const [copied, setCopied] = useState(false);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const newLogs = [...terminalLogs, `$ ${cmd}`];

    if (cmd === 'help') {
      newLogs.push(
        'Available simulated commands: git status, git log, npm test, pytest, ollama list, python core/kernel.py, clear'
      );
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd.includes('git status')) {
      newLogs.push('On branch main. Working tree clean. Synced with local repository.');
    } else if (cmd.includes('npm test') || cmd.includes('test')) {
      newLogs.push(
        'Running Node.js test runner...',
        '✔ src/core/intentParser.test.ts (4 tests passed, 431ms)',
        '✔ src/core/modelRouter.test.ts (3 tests passed, 385ms)',
        '✔ src/core/agentOrchestrator.test.ts (3 tests passed, 401ms)',
        '✔ src/core/memoryStore.test.ts (2 tests passed, 388ms)',
        '100% tests passed. All 12 unit tests green.'
      );
    } else if (cmd.includes('ollama list')) {
      newLogs.push(
        'NAME                ID           SIZE      MODIFIED',
        'qwen2.5-coder:3b    e712a0f8b    1.9 GB    2 hours ago',
        'qwen3:4b            f4019ab23    2.4 GB    5 hours ago'
      );
    } else if (cmd.includes('python')) {
      newLogs.push(
        '[JARVIS] Kernel execution test initiated...',
        '[JARVIS] Verified thread limits on Intel i7-1355U.',
        '[JARVIS] Execution lifecycle verified with 0 errors.'
      );
    } else {
      newLogs.push(`Command "${cmd}" executed successfully in sandbox.`);
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const handleCopyCode = () => {
    if (selectedFile.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTree = (node: FileNode, level = 0) => {
    if (node.type === 'folder') {
      return (
        <div key={node.path} className="space-y-1">
          <div
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold py-1 px-2 rounded hover:bg-cyan-950/40 cursor-default"
            style={{ paddingLeft: `${level * 14 + 8}px` }}
          >
            <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
            <span>{node.name}</span>
          </div>
          {node.children?.map(child => renderTree(child, level + 1))}
        </div>
      );
    }

    const isSelected = selectedFile.path === node.path;

    return (
      <div
        key={node.path}
        onClick={() => setSelectedFile(node)}
        className={`flex items-center gap-1.5 text-xs font-mono py-1 px-2 rounded cursor-pointer transition-colors ${
          isSelected
            ? 'bg-cyan-900/60 text-cyan-200 border-l-2 border-cyan-400 font-semibold'
            : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30'
        }`}
        style={{ paddingLeft: `${level * 14 + 8}px` }}
      >
        <FileCode className="w-3.5 h-3.5 text-cyan-400/80" />
        <span className="truncate">{node.name}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#030814]/70">
      {/* File Tree Explorer */}
      <div className="w-full lg:w-72 border-r border-cyan-500/20 bg-black/40 flex flex-col shrink-0">
        <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between">
          <span className="text-xs font-tech font-bold text-cyan-300 tracking-wider flex items-center gap-1.5">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            PROJECT EXPLORER
          </span>
          <span className="text-[10px] font-mono text-slate-500">Host Target</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {renderTree(SAMPLE_PROJECT_TREE)}
        </div>
        <div className="p-3 border-t border-cyan-500/20 bg-black/60 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>Branch: main (Clean)</span>
        </div>
      </div>

      {/* Editor & Terminal Center */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Code Editor Header */}
        <div className="px-4 py-2.5 bg-black/60 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">{selectedFile.name}</span>
            <span className="text-slate-500">({selectedFile.path})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded bg-black/40 border border-cyan-500/30 text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi' : 'Nusxa'}</span>
            </button>
          </div>
        </div>

        {/* Code Preview Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#020611] font-mono text-xs leading-relaxed text-cyan-100/90 select-text">
          <pre className="overflow-x-auto">
            <code>{selectedFile.content || '// Fayl bo\'sh'}</code>
          </pre>
        </div>

        {/* Interactive Terminal Panel */}
        <div className="h-64 border-t border-cyan-500/30 bg-[#010409] flex flex-col shrink-0">
          <div className="px-3 py-1.5 bg-black/60 border-b border-cyan-500/20 flex items-center justify-between text-xs font-mono text-cyan-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold">DEVELOPER TERMINAL (WS // BASH)</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Intel i7-1355U Shell Execution
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 text-slate-300">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith('$')
                    ? 'text-cyan-300 font-bold'
                    : log.includes('✔')
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleRunCommand} className="p-2 bg-black/70 border-t border-cyan-500/20 flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-xs font-bold pl-1">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={e => setTerminalInput(e.target.value)}
              placeholder="Buyruq kiriting (masalan: 'npm test', 'git status', 'ollama list')..."
              className="flex-1 bg-transparent text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 text-cyan-300 text-xs font-mono"
            >
              Run
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
