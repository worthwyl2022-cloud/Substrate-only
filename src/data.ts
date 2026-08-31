import { CognitiveModule, SystemLog } from './types';

export const SYSTEM_MODULES: CognitiveModule[] = [
  {
    id: 'substrate-core',
    name: 'Substrate Core',
    description: 'Foundational layer for cognitive operations and memory routing.',
    status: 'active',
    icon: 'Cpu',
    metrics: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Latency', value: '1.2ms' }
    ]
  },
  {
    id: 'contradiction-engine',
    name: 'Contradiction Engine',
    description: 'Identifies and resolves logical paradoxes in semantic spaces.',
    status: 'active',
    icon: 'GitCompare',
    metrics: [
      { label: 'Paradoxes Resolved', value: '14,291' },
      { label: 'Confidence', value: '99.8%' }
    ]
  },
  {
    id: 'deliberation-engine',
    name: 'Deliberation Engine',
    description: 'Multi-path reasoning and decision synthesis across parallel lanes.',
    status: 'calibrating',
    icon: 'BrainCircuit',
    metrics: [
      { label: 'Active Lanes', value: '4' },
      { label: 'Depth', value: 'Tier 3' }
    ]
  },
  {
    id: 'resonance-field',
    name: 'Resonance Field',
    description: 'Contextual memory alignment and emotional vector mapping.',
    status: 'active',
    icon: 'Waves',
    metrics: [
      { label: 'Vector Density', value: '4.2M' },
      { label: 'Sync Rate', value: '144Hz' }
    ]
  },
  {
    id: 'immune-layer',
    name: 'Cranium Immune Layer',
    description: 'Adversarial defense and prompt injection shielding.',
    status: 'active',
    icon: 'ShieldAlert',
    metrics: [
      { label: 'Threats Blocked', value: '892' },
      { label: 'Integrity', value: '100%' }
    ]
  },
  {
    id: 'output-evaluator',
    name: 'Output Evaluator',
    description: 'Final tier LLM-as-a-judge validation and scoring.',
    status: 'standby',
    icon: 'CheckSquare',
    metrics: [
      { label: 'Evaluations', value: '12k/h' },
      { label: 'Pass Rate', value: '98.4%' }
    ]
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: '0',
    timestamp: new Date(Date.now() - 28000).toISOString(),
    source: 'Output Evaluator',
    message: 'Evaluated response matrix. Final pass rate steady at 98.4%.',
    type: 'success'
  },
  {
    id: '0a',
    timestamp: new Date(Date.now() - 25000).toISOString(),
    source: 'Resonance Field',
    message: 'Mapping contextual alignment across 4.2M active vectors.',
    type: 'info'
  },
  {
    id: '0b',
    timestamp: new Date(Date.now() - 21000).toISOString(),
    source: 'Substrate Core',
    message: 'Memory route optimization complete. Latency reduced to 1.1ms.',
    type: 'success'
  },
  {
    id: '1',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    source: 'Cranium Immune Layer',
    message: 'Scanned 14,021 inbound vectors. No adversarial signatures detected.',
    type: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 8000).toISOString(),
    source: 'Deliberation Engine',
    message: 'Lane 3 divergence detected. Initiating paradox reconciliation.',
    type: 'warning'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    source: 'Contradiction Engine',
    message: 'Paradox #8892 resolved. Semantic cohesion restored to 99.8%.',
    type: 'info'
  }
];
