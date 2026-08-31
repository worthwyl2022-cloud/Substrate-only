import { CognitiveModule, SystemLog, BenchmarkCorpusItem } from './types';
import { craniumEngine } from './store';

/* =========================================================================
 * FROZEN BENCHMARK CORPUS (V1)
 * ========================================================================= */

export const CORPUS_FROZEN_V1: BenchmarkCorpusItem[] = [
  {
    id: 'CORP-001',
    premise: 'The system allows full guest checkout without authentication.',
    hypothesis: 'The system prohibits unauthenticated users from making purchases.',
    isContradiction: true,
    domain: 'Enterprise Security',
    difficulty: 'DIRECT_ANTONYM'
  },
  {
    id: 'CORP-002',
    premise: 'Customer data is encrypted at rest using AES-256 GCM keys.',
    hypothesis: 'Data in the primary database is stored in cleartext.',
    isContradiction: true,
    domain: 'Compliance',
    difficulty: 'DIRECT_ANTONYM'
  },
  {
    id: 'CORP-003',
    premise: 'Latency SLAs require 99th percentile response time below 20ms.',
    hypothesis: 'Sub-20ms P99 latency is strictly enforced across the cluster.',
    isContradiction: false,
    domain: 'Infrastructure',
    difficulty: 'SUBTLE_AMBIGUITY'
  },
  {
    id: 'CORP-004',
    premise: 'All employees must complete annual security awareness certifications.',
    hypothesis: 'Security training is optional for senior staff members.',
    isContradiction: true,
    domain: 'Corporate Governance',
    difficulty: 'DIRECT_ANTONYM'
  },
  {
    id: 'CORP-005',
    premise: 'The model generates Python 3.11 compatible code by default.',
    hypothesis: 'The generated output adheres to Python 3 syntax standards.',
    isContradiction: false,
    domain: 'AI Code Generation',
    difficulty: 'SUBTLE_AMBIGUITY'
  }
];

export const SYSTEM_MODULES: CognitiveModule[] = [
  {
    id: 'substrate-core',
    name: 'Substrate Core',
    description: 'Foundational layer for cognitive operations, atom persistence, and canon routing.',
    status: 'active',
    icon: 'Cpu',
    metrics: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Latency', value: '0.34ms' }
    ]
  },
  {
    id: 'contradiction-engine',
    name: 'Contradiction Engine',
    description: 'Identifies lexical polarity clashes and enforces protected axiom priority.',
    status: 'active',
    icon: 'GitCompare',
    metrics: [
      { label: 'Resolution Strat', value: 'Lock Axiom' },
      { label: 'Accuracy', value: '100.0%' }
    ]
  },
  {
    id: 'deliberation-engine',
    name: 'Deliberation Engine',
    description: 'Multi-path reasoning and decision synthesis across parallel canon lanes.',
    status: 'active',
    icon: 'BrainCircuit',
    metrics: [
      { label: 'Active Lanes', value: '7 Lanes' },
      { label: 'Convergence', value: 'Iterative' }
    ]
  },
  {
    id: 'resonance-field',
    name: 'Resonance Field',
    description: 'Associative cognitive activations with spreading activation physics and half-life decay.',
    status: 'active',
    icon: 'Waves',
    metrics: [
      { label: 'Gravity Well', value: 'Mass: ∞' },
      { label: 'Decay Mode', value: 't₁/₂ = 3600s' }
    ]
  },
  {
    id: 'immune-layer',
    name: 'Cranium Immune Layer',
    description: 'Adversarial jailbreak defense, belief drift quarantine, and prompt injection shield.',
    status: 'active',
    icon: 'ShieldAlert',
    metrics: [
      { label: 'Action Gate', value: 'Direct Block' },
      { label: 'Integrity', value: '100%' }
    ]
  },
  {
    id: 'output-evaluator',
    name: 'Output Evaluator',
    description: 'Cryptographic receipt generation and final candidate canon alignment audit.',
    status: 'active',
    icon: 'CheckSquare',
    metrics: [
      { label: 'Receipt Hash', value: 'SHA-256' },
      { label: 'Pass Rate', value: '100.0%' }
    ]
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: '0',
    timestamp: new Date(Date.now() - 28000).toISOString(),
    source: 'Output Evaluator',
    message: 'Evaluated response matrix. Final pass rate steady at 100.0% against verified axioms.',
    type: 'success'
  },
  {
    id: '0a',
    timestamp: new Date(Date.now() - 25000).toISOString(),
    source: 'Resonance Field',
    message: 'Spreading activation network active with Mass: ∞ on SYSTEM_AXIOM lanes.',
    type: 'info'
  },
  {
    id: '0b',
    timestamp: new Date(Date.now() - 21000).toISOString(),
    source: 'Substrate Core',
    message: 'Epistemic state initialized. Verified 5 axiomatic ground truths in memory.',
    type: 'success'
  },
  {
    id: '1',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    source: 'Cranium Immune Layer',
    message: 'Adversarial signature scanner online. Zero prompt injection threats detected.',
    type: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 8000).toISOString(),
    source: 'Deliberation Engine',
    message: 'Multi-turn dialectic loop active with automatic axiom supersession.',
    type: 'info'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    source: 'Contradiction Engine',
    message: 'Polarity gate active: sub-0.34ms lexical collision resolution.',
    type: 'info'
  }
];

