/**
 * WorthWyl Creative OS / Cranium Core v3.2
 * A dynamical creative nervous system & governance engine (Reference Implementation)
 * 
 * Architectural Capabilities:
 * - Real multi-scale memory with strict EXCLUSIVE tier membership (no double-counting)
 * - Pairwise multi-body vector physics + velocity/displacement dampening + continuous decay
 * - Split Honest Metrics: valence, arousal, conflict, charge_coherence, semantic_coherence,
 *   continuity, theme_drift, identity_pressure, field_energy, human_influence
 * - Hybrid Retriever with dynamic directive-weighted ranking:
 *   score = α·semantic + β·temporal + γ·identity + δ·theme + ε·human + ζ·(mass × energy)
 * - First-class high-mass human injection with dedicated LISTEN channel
 * - Locked identity seeding with author provenance & inviolable invariant boundary
 * - Closed Evaluation Write-Back Loop:
 *   generate → evaluate (identity, theme, constraints) → identity gate (reject/retry) → write-back
 */

export type CreativeAtomKind = 'working' | 'episodic' | 'theme' | 'identity' | 'human';

export type CreativeDirective = 
  | 'STABILIZE' 
  | 'ESCALATE' 
  | 'DEEPEN' 
  | 'SHIFT' 
  | 'CONSOLIDATE' 
  | 'PROTECT' 
  | 'ADVANCE' 
  | 'REST' 
  | 'LISTEN';

export interface CreativeAtom {
  id: string;
  charge: number;                  // emotional valence [-1, 1]
  mass: number;                    // importance / inertia [0.2, 50.0]
  velocity: [number, number];      // 2D velocity in semantic-affective phase space
  position: [number, number];      // 2D position in semantic-affective phase space
  tags: Set<string>;
  kind: CreativeAtomKind;
  content: string;
  createdAt: number;
  lastActive: number;
  energy: number;                  // [0.0, 1.0]
  humanImportance: number;         // [0.0, 2.0]
  locked: boolean;                 // If true, immune to standard decay and displacement
  provenance: string;              // e.g. "seed_identity", "human_inject", "episodic_step", "writeback"
  simBorn?: number;
  embeddingVector?: number[];      // Prototype similarity vector
}

export interface FieldMetrics {
  valence: number;                 // Mean weighted emotional charge [-1, 1]
  arousal: number;                 // Raw emotional intensity/energy [0, 2.0]
  conflict: number;                // Polar opposition/dialectic tension [0, 1.6]
  charge_coherence: number;        // Charge consistency [0, 1]
  semantic_coherence: number;      // Semantic alignment across active atoms [0, 1]
  continuity: number;              // Recent sequence tag/embedding overlap [0, 1]
  theme_drift: number;             // Divergence from established thematic attractors [0, 1]
  identity_pressure: number;       // Distance of current trajectory from locked identity [0, 1]
  field_energy: number;            // Total active kinetic & potential field energy [0, 3]
  identity_strength: number;       // Mass of active identity core [0, 1]
  human_influence: number;         // Mass of active human channel [0, 2.0]
}

export interface RetrievalWeights {
  alpha_semantic: number;
  beta_temporal: number;
  gamma_identity: number;
  delta_theme: number;
  epsilon_human: number;
  zeta_mass_energy: number;
}

export interface AdaptiveThresholds {
  coherence_floor: number;
  continuity_floor: number;
  conflict_floor: number;
  conflict_ceiling: number;
  arousal_floor: number;
  arousal_ceiling: number;
  theme_drift_ceiling: number;
  energy_floor: number;
  human_attention: number;
  identity_pressure_ceiling: number;
}

export const DEFAULT_ADAPTIVE_THRESHOLDS: AdaptiveThresholds = {
  coherence_floor: 0.58,
  continuity_floor: 0.36,
  conflict_floor: 0.15,
  conflict_ceiling: 0.85,
  arousal_floor: 0.20,
  arousal_ceiling: 1.40,
  theme_drift_ceiling: 0.50,
  energy_floor: 0.22,
  human_attention: 0.55,
  identity_pressure_ceiling: 0.40,
};

// ─────────────────────────────────────────────────────────────
// 1. Semantic Engine & Embeddings
// ─────────────────────────────────────────────────────────────

const THEME_KEYWORDS: Record<string, string[]> = {
  isolation: ['alone', 'solitude', 'isolation', 'loneliness', 'silence', 'separation', 'unanswered', 'drifting', 'empty', 'distant'],
  meaning: ['purpose', 'meaning', 'significance', 'value', 'why', 'matter', 'worth', 'reason', 'point', 'question', 'soul'],
  conflict: ['struggle', 'conflict', 'fight', 'tension', 'opposition', 'battle', 'war', 'resistance', 'pressure', 'clash'],
  technology: ['machine', 'system', 'code', 'artificial', 'intelligence', 'robot', 'circuit', 'process', 'subroutine', 'architecture', 'algorithm'],
  space: ['cosmos', 'void', 'orbit', 'stars', 'spaceship', 'planet', 'universe', 'celestial', 'gravity', 'deep'],
  memory: ['remember', 'memory', 'past', 'echo', 'forgotten', 'recollection', 'archive', 'checksum', 'record', 'trace'],
  transformation: ['change', 'become', 'evolve', 'transform', 'metamorphosis', 'shift', 'rewrite', 'awaken', 'emerge', 'reorganize'],
  connection: ['together', 'bond', 'relationship', 'intimacy', 'contact', 'presence', 'human', 'voice', 'touch', 'communion'],
  loss: ['grief', 'absence', 'disappearance', 'ending', 'vanishing', 'gone', 'death', 'extinction', 'decay', 'perish'],
  creation: ['create', 'make', 'build', 'invent', 'generate', 'birth', 'origin', 'genesis', 'fuel', 'seed']
};

export class SemanticEngine {
  public themes = Object.keys(THEME_KEYWORDS);

  public embed(text: string): number[] {
    const norm = text.toLowerCase();
    const words = norm.split(/\W+/).filter(w => w.length > 2);
    const vector = this.themes.map(theme => {
      const keywords = THEME_KEYWORDS[theme];
      let score = 0;
      for (const kw of keywords) {
        if (norm.includes(kw)) score += 1.0;
        for (const w of words) {
          if (w.startsWith(kw) || kw.startsWith(w)) score += 0.5;
        }
      }
      return score;
    });

    const normMagnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1.0;
    return vector.map(v => v / normMagnitude);
  }

  public tagsFor(text: string, threshold = 0.20): Set<string> {
    const vec = this.embed(text);
    const tags = new Set<string>();
    this.themes.forEach((theme, idx) => {
      if (vec[idx] > threshold) {
        tags.add(theme);
      }
    });
    if (tags.size === 0) tags.add('neutral');
    return tags;
  }

  public cosineSimilarity(a: number[], b: number[]): number {
    if (!a.length || !b.length || a.length !== b.length) return 0.0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  public project2D(text: string, charge: number): [number, number] {
    const vec = this.embed(text);
    const xCoord = (
      (vec[0] + vec[3] + vec[4]) * -0.6 + // isolation, tech, space (left)
      (vec[1] + vec[7] + vec[9]) * 0.6    // meaning, connection, creation (right)
    );
    const yCoord = charge * 0.8;
    return [Math.max(-0.95, Math.min(0.95, xCoord)), Math.max(-0.95, Math.min(0.95, yCoord))];
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Exclusive Multi-Scale Memory (Zero Cross-Tier Overlap)
// ─────────────────────────────────────────────────────────────

export class MultiScaleMemory {
  // Exclusive primary stores: an atom exists in strictly ONE primary bucket
  public working: CreativeAtom[] = [];
  public episodic: CreativeAtom[] = [];
  public themes: Map<string, CreativeAtom> = new Map();
  public identity: CreativeAtom[] = [];
  public human: CreativeAtom[] = []; // Dedicated human channel

  private removeAtomFromAll(id: string) {
    this.working = this.working.filter(a => a.id !== id);
    this.episodic = this.episodic.filter(a => a.id !== id);
    for (const [k, v] of this.themes.entries()) {
      if (v.id === id) this.themes.delete(k);
    }
    this.identity = this.identity.filter(a => a.id !== id);
    this.human = this.human.filter(a => a.id !== id);
  }

  public inject(atom: CreativeAtom) {
    // Enforce exclusive membership
    this.removeAtomFromAll(atom.id);

    if (atom.kind === 'working') {
      this.working.push(atom);
    } else if (atom.kind === 'episodic') {
      this.episodic.unshift(atom);
      if (this.episodic.length > 220) this.episodic.pop();
    } else if (atom.kind === 'theme') {
      for (const tag of atom.tags) {
        const existing = this.themes.get(tag);
        if (!existing || atom.mass > existing.mass) {
          this.themes.set(tag, atom);
        }
      }
    } else if (atom.kind === 'identity') {
      this.identity.push(atom);
    } else if (atom.kind === 'human') {
      this.human.push(atom);
    }
  }

  public allActive(): CreativeAtom[] {
    const seen = new Set<string>();
    const result: CreativeAtom[] = [];
    const candidates = [
      ...this.working,
      ...this.episodic,
      ...Array.from(this.themes.values()),
      ...this.identity,
      ...this.human
    ];

    for (const a of candidates) {
      if (!seen.has(a.id) && (a.energy > 0.04 || a.locked)) {
        seen.add(a.id);
        result.push(a);
      }
    }
    return result;
  }

  public consolidate(thresholdEnergy = 0.28, simTime = 0.0) {
    // Working → Episodic promotion (moves item, no double counting)
    const workingSurvivors: CreativeAtom[] = [];
    for (const a of this.working) {
      if (a.energy > thresholdEnergy && a.mass > 1.2) {
        a.kind = 'episodic';
        this.episodic.unshift(a);
        if (this.episodic.length > 220) this.episodic.pop();
      } else if (a.energy > 0.05) {
        workingSurvivors.push(a);
      }
    }
    this.working = workingSurvivors;

    // Strong Episodic → Theme promotion (removes from episodic to preserve exclusivity)
    const toPromote: CreativeAtom[] = [];
    this.episodic = this.episodic.filter(a => {
      const born = a.simBorn || 0.0;
      const atomAge = simTime - born;
      if (a.energy > 0.48 && a.mass > 2.8 && atomAge > 0.9 && a.kind === 'episodic') {
        a.kind = 'theme';
        toPromote.push(a);
        return false; // Remove from episodic!
      }
      return true;
    });

    for (const a of toPromote) {
      this.inject(a);
    }
  }

  public decayAll(dt: number) {
    for (const a of this.allActive()) {
      if (a.locked) continue; // Locked identity/axioms never decay

      let rate = 0.018;
      if (a.kind === 'identity') rate *= 0.03;
      else if (a.kind === 'theme') rate *= 0.20;
      else if (a.kind === 'human') rate *= 0.12; // Human intent persists 8x longer

      a.energy = Math.max(0.0, a.energy - rate * dt);
      a.mass *= Math.pow(0.9993, dt * 8);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Resonance Field Multi-Body Vector Dynamics
// ─────────────────────────────────────────────────────────────

function tagOverlap(a: CreativeAtom, b: CreativeAtom): number {
  if (!a.tags.size || !b.tags.size) return 0.0;
  let inter = 0;
  for (const t of a.tags) {
    if (b.tags.has(t)) inter++;
  }
  const union = new Set([...a.tags, ...b.tags]).size;
  return union ? inter / union : 0.0;
}

export class ResonanceField {
  public memory = new MultiScaleMemory();
  public time = 0.0;
  private semantic = new SemanticEngine();

  public inject(atom: CreativeAtom) {
    atom.simBorn = this.time;
    this.memory.inject(atom);
  }

  public step(dt = 0.12) {
    const atoms = this.memory.allActive().filter(a => a.energy > 0.05 || a.locked);
    if (atoms.length < 2) {
      this.memory.decayAll(dt);
      this.time += dt;
      this.memory.consolidate(0.28, this.time);
      return;
    }

    const forces: Map<string, [number, number]> = new Map();
    atoms.forEach(a => forces.set(a.id, [0, 0]));

    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a = atoms[i];
        const b = atoms[j];

        const dx = b.position[0] - a.position[0];
        const dy = b.position[1] - a.position[1];
        const dist = Math.sqrt(dx * dx + dy * dy) + 1e-5;
        const dirX = dx / dist;
        const dirY = dy / dist;

        const chargeFactor = a.charge * b.charge;
        const semanticOverlap = tagOverlap(a, b);
        const embSim = (a.embeddingVector && b.embeddingVector)
          ? this.semantic.cosineSimilarity(a.embeddingVector, b.embeddingVector)
          : 0.2;

        const coupling = 0.45 * chargeFactor + 0.30 * (2 * semanticOverlap - 1) + 0.25 * (2 * embSim - 1);
        const strength = (a.mass * b.mass * coupling) / (Math.pow(dist, 1.4) + 0.7);

        const fx = dirX * strength * 0.04;
        const fy = dirY * strength * 0.04;

        const fA = forces.get(a.id)!;
        const fB = forces.get(b.id)!;
        fA[0] += fx;
        fA[1] += fy;
        fB[0] -= fx;
        fB[1] -= fy;
      }
    }

    for (const a of atoms) {
      if (a.locked) continue; // Locked atoms have infinite inertia

      const f = forces.get(a.id) || [0, 0];
      const effMass = Math.max(a.mass, 0.2);
      const accelX = f[0] / effMass;
      const accelY = f[1] / effMass;

      a.velocity[0] = a.velocity[0] * 0.90 + accelX * dt;
      a.velocity[1] = a.velocity[1] * 0.90 + accelY * dt;

      a.position[0] = Math.max(-0.95, Math.min(0.95, a.position[0] + a.velocity[0] * dt));
      a.position[1] = Math.max(-0.95, Math.min(0.95, a.position[1] + a.velocity[1] * dt));
      a.lastActive = Date.now();
    }

    this.memory.decayAll(dt);
    this.time += dt;
    this.memory.consolidate(0.28, this.time);
  }

  public metrics(): FieldMetrics {
    const atoms = this.memory.allActive().filter(a => a.energy > 0.07 || a.locked);
    if (!atoms.length) {
      return {
        valence: 0.0,
        arousal: 0.0,
        conflict: 0.0,
        charge_coherence: 1.0,
        semantic_coherence: 1.0,
        continuity: 0.5,
        theme_drift: 0.0,
        identity_pressure: 0.0,
        field_energy: 0.0,
        identity_strength: 0.0,
        human_influence: 0.0,
      };
    }

    const totalMass = atoms.reduce((sum, a) => sum + a.mass * a.energy, 0) + 1e-6;
    const valence = atoms.reduce((sum, a) => sum + a.charge * a.mass * a.energy, 0) / totalMass;
    const arousal = atoms.reduce((sum, a) => sum + Math.abs(a.charge) * a.mass * a.energy, 0) / totalMass;

    // Conflict & charge coherence
    const charges = atoms.map(a => a.charge);
    const meanCharge = charges.reduce((s, c) => s + c, 0) / charges.length;
    const variance = charges.reduce((s, c) => s + Math.pow(c - meanCharge, 2), 0) / charges.length;
    const stdCharge = Math.sqrt(variance);
    const chargeCoherence = Math.max(0.0, 1.0 - stdCharge * 1.25);

    // Antinomic dialectic conflict (measuring polar opposing charges)
    const positiveMass = atoms.filter(a => a.charge > 0.2).reduce((s, a) => s + a.mass * a.energy, 0);
    const negativeMass = atoms.filter(a => a.charge < -0.2).reduce((s, a) => s + a.mass * a.energy, 0);
    const conflict = (2.0 * Math.min(positiveMass, negativeMass)) / totalMass;

    // Semantic coherence across active embeddings
    let semSimSum = 0;
    let semPairs = 0;
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        if (atoms[i].embeddingVector && atoms[j].embeddingVector) {
          semSimSum += this.semantic.cosineSimilarity(atoms[i].embeddingVector!, atoms[j].embeddingVector!);
          semPairs++;
        }
      }
    }
    const semanticCoherence = semPairs > 0 ? Math.max(0.0, semSimSum / semPairs) : 0.85;

    // Continuity across recent episodic atoms
    const recent = [...atoms].sort((a, b) => b.lastActive - a.lastActive).slice(0, 12);
    let continuity = 0.55;
    if (recent.length > 2) {
      const overlaps: number[] = [];
      for (let i = 0; i < recent.length - 1; i++) {
        overlaps.push(tagOverlap(recent[i], recent[i + 1]));
      }
      continuity = overlaps.reduce((s, v) => s + v, 0) / overlaps.length;
    }

    // Theme drift from established theme prototypes
    const themeAtoms = Array.from(this.memory.themes.values());
    let themeDrift = 0.0;
    if (themeAtoms.length > 0) {
      const drifts: number[] = [];
      for (const a of atoms) {
        if (a.kind === 'working' || a.kind === 'episodic') {
          let best = 0;
          for (const t of themeAtoms) {
            const ol = tagOverlap(a, t);
            if (ol > best) best = ol;
          }
          drifts.push(1.0 - best);
        }
      }
      themeDrift = drifts.length ? drifts.reduce((s, v) => s + v, 0) / drifts.length : 0.0;
    }

    // Identity pressure (divergence between active working atoms and locked identity core)
    let identityPressure = 0.0;
    if (this.memory.identity.length > 0) {
      const idAtoms = this.memory.identity;
      const activeWorking = atoms.filter(a => a.kind === 'working' || a.kind === 'episodic');
      if (activeWorking.length > 0) {
        const idDivergences: number[] = [];
        for (const w of activeWorking) {
          let bestSim = 0;
          for (const idA of idAtoms) {
            if (w.embeddingVector && idA.embeddingVector) {
              const sim = this.semantic.cosineSimilarity(w.embeddingVector, idA.embeddingVector);
              if (sim > bestSim) bestSim = sim;
            }
          }
          idDivergences.push(1.0 - bestSim);
        }
        identityPressure = idDivergences.reduce((s, v) => s + v, 0) / idDivergences.length;
      }
    }

    const fieldEnergy = atoms.reduce((sum, a) => sum + a.energy * a.mass, 0) / Math.max(atoms.length, 1);
    const identityStrength = this.memory.identity.reduce((sum, a) => sum + a.mass * (a.locked ? 1.0 : a.energy), 0) / 18.0;
    const humanInfluence = this.memory.human.reduce((sum, a) => sum + a.mass * a.energy * a.humanImportance, 0) / 12.0;

    return {
      valence: Math.max(-1.0, Math.min(1.0, valence)),
      arousal: Math.max(0.0, Math.min(2.0, arousal)),
      conflict: Math.max(0.0, Math.min(1.6, conflict)),
      charge_coherence: Math.max(0.0, Math.min(1.0, chargeCoherence)),
      semantic_coherence: Math.max(0.0, Math.min(1.0, semanticCoherence)),
      continuity: Math.max(0.0, Math.min(1.0, continuity)),
      theme_drift: Math.max(0.0, Math.min(1.0, themeDrift)),
      identity_pressure: Math.max(0.0, Math.min(1.0, identityPressure)),
      field_energy: fieldEnergy,
      identity_strength: Math.max(0.0, Math.min(1.0, identityStrength)),
      human_influence: Math.max(0.0, Math.min(2.0, humanInfluence)),
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 4. Directive Engine & Operational Effect Mapping
// ─────────────────────────────────────────────────────────────

export function resolveDirectives(metrics: FieldMetrics, thresholds: AdaptiveThresholds): CreativeDirective[] {
  const d: CreativeDirective[] = [];

  // High human signal triggers LISTEN immediately
  if (metrics.human_influence > thresholds.human_attention) {
    d.push('LISTEN');
  }

  // Identity pressure or theme drift under high identity strength triggers PROTECT
  if (metrics.identity_pressure > thresholds.identity_pressure_ceiling || 
     (metrics.identity_strength > 0.4 && metrics.theme_drift > 0.32)) {
    d.push('PROTECT');
  }

  // Conflict or low charge/semantic coherence triggers STABILIZE
  if (metrics.charge_coherence < thresholds.coherence_floor || 
      metrics.continuity < thresholds.continuity_floor || 
      metrics.conflict > thresholds.conflict_ceiling) {
    d.push('STABILIZE');
  }

  // Low arousal/conflict triggers ESCALATE
  if (metrics.arousal < thresholds.arousal_floor && metrics.conflict < thresholds.conflict_floor) {
    d.push('ESCALATE');
  }

  // High thematic drift triggers controlled SHIFT
  if (metrics.theme_drift > thresholds.theme_drift_ceiling) {
    d.push('SHIFT');
  }

  // High energy triggers CONSOLIDATE, low energy triggers REST
  if (metrics.field_energy < thresholds.energy_floor) {
    d.push('REST');
  } else if (metrics.field_energy > 1.9) {
    d.push('CONSOLIDATE');
  }

  if (d.length === 0) {
    d.push('ADVANCE');
  }

  return d.slice(0, 3);
}

/**
 * Maps live directives into dynamic retrieval weights for hybrid ranking
 */
export function getDirectiveRetrievalWeights(directives: CreativeDirective[]): RetrievalWeights {
  const base: RetrievalWeights = {
    alpha_semantic: 0.35,
    beta_temporal: 0.20,
    gamma_identity: 0.15,
    delta_theme: 0.15,
    epsilon_human: 0.10,
    zeta_mass_energy: 0.05
  };

  if (directives.includes('LISTEN')) {
    base.epsilon_human = 0.50;
    base.alpha_semantic = 0.20;
    base.beta_temporal = 0.15;
    base.gamma_identity = 0.10;
    base.delta_theme = 0.05;
  } else if (directives.includes('PROTECT')) {
    base.gamma_identity = 0.45;
    base.delta_theme = 0.25;
    base.alpha_semantic = 0.15;
    base.beta_temporal = 0.05;
    base.zeta_mass_energy = 0.10;
  } else if (directives.includes('STABILIZE') || directives.includes('CONSOLIDATE')) {
    base.gamma_identity = 0.30;
    base.delta_theme = 0.30;
    base.alpha_semantic = 0.25;
    base.beta_temporal = 0.10;
    base.zeta_mass_energy = 0.05;
  } else if (directives.includes('ESCALATE') || directives.includes('SHIFT')) {
    base.alpha_semantic = 0.45;
    base.beta_temporal = 0.30;
    base.delta_theme = 0.10;
    base.gamma_identity = 0.10;
    base.zeta_mass_energy = 0.05;
  }

  return base;
}

// ─────────────────────────────────────────────────────────────
// 5. Hybrid Retriever
// ─────────────────────────────────────────────────────────────

export interface ScoredAtom {
  atom: CreativeAtom;
  score: number;
  breakdown: {
    semantic: number;
    temporal: number;
    identity: number;
    theme: number;
    human: number;
    massEnergy: number;
  };
}

export class HybridRetriever {
  private semantic = new SemanticEngine();

  public retrieve(
    query: string,
    memory: MultiScaleMemory,
    weights: RetrievalWeights,
    topK = 5
  ): ScoredAtom[] {
    const allAtoms = memory.allActive();
    if (!allAtoms.length) return [];

    const qVec = this.semantic.embed(query);
    const now = Date.now();

    const identityIds = new Set(memory.identity.map(a => a.id));
    const themeIds = new Set(Array.from(memory.themes.values()).map(a => a.id));
    const humanIds = new Set(memory.human.map(a => a.id));

    const scored: ScoredAtom[] = allAtoms.map(atom => {
      // 1. Semantic similarity
      const semScore = atom.embeddingVector 
        ? this.semantic.cosineSimilarity(qVec, atom.embeddingVector)
        : 0.1;

      // 2. Temporal recency (exponential decay over 1 hour)
      const ageHours = (now - atom.lastActive) / (1000 * 3600);
      const tempScore = Math.exp(-ageHours * 0.5);

      // 3. Identity alignment
      const idScore = identityIds.has(atom.id) || atom.locked ? 1.0 : 0.0;

      // 4. Theme affinity
      const themeScore = themeIds.has(atom.id) ? 1.0 : 0.0;

      // 5. Human importance
      const humanScore = humanIds.has(atom.id) ? Math.min(1.0, atom.humanImportance) : 0.0;

      // 6. Dynamical weight (mass × energy)
      const massEnergyScore = Math.min(1.0, (atom.mass * atom.energy) / 20.0);

      const totalScore = (
        weights.alpha_semantic * semScore +
        weights.beta_temporal * tempScore +
        weights.gamma_identity * idScore +
        weights.delta_theme * themeScore +
        weights.epsilon_human * humanScore +
        weights.zeta_mass_energy * massEnergyScore
      );

      return {
        atom,
        score: totalScore,
        breakdown: {
          semantic: semScore,
          temporal: tempScore,
          identity: idScore,
          theme: themeScore,
          human: humanScore,
          massEnergy: massEnergyScore
        }
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

// ─────────────────────────────────────────────────────────────
// 6. Steering Context Builder & Generator Interface
// ─────────────────────────────────────────────────────────────

export class SteeringContext {
  public build(
    metrics: FieldMetrics,
    directives: CreativeDirective[],
    memory: MultiScaleMemory,
    retrieved: ScoredAtom[],
    recentContent: string[]
  ): string {
    const dirStr = directives.join(', ');
    const themes = Array.from(memory.themes.keys());
    const identityBits = memory.identity.slice(-3).map(a => a.content.slice(0, 70));
    const humanBits = memory.human.slice(-3).map(a => a.content.slice(0, 70));

    const parts = [
      `DIRECTIVES: ${dirStr}`,
      `FIELD STATE → valence:${metrics.valence >= 0 ? '+' : ''}${metrics.valence.toFixed(2)} arousal:${metrics.arousal.toFixed(2)} conflict:${metrics.conflict.toFixed(2)} coherence:${metrics.charge_coherence.toFixed(2)} drift:${metrics.theme_drift.toFixed(2)} id_pressure:${metrics.identity_pressure.toFixed(2)}`,
      `ACTIVE THEMES: ${themes.length ? themes.join(', ') : 'none yet'}`
    ];

    if (identityBits.length) {
      parts.push(`IDENTITY CORE (INVARIANT): ${identityBits.join(' | ')}`);
    }
    if (humanBits.length) {
      parts.push(`HUMAN INTENT (HIGH MASS): ${humanBits.join(' | ')}`);
    }
    if (retrieved.length) {
      parts.push(`RETRIEVED CONTEXT (DIRECTIVE-WEIGHTED):\n${retrieved.map(r => `- [${r.atom.kind.toUpperCase()}] ${r.atom.content} (score: ${r.score.toFixed(2)})`).join('\n')}`);
    }
    if (recentContent.length) {
      parts.push(`RECENT CONTEXT:\n${recentContent.slice(-4).map(c => `- ${c}`).join('\n')}`);
    }

    const guidance: string[] = [];
    for (const d of directives) {
      if (d === 'STABILIZE') guidance.push("Reduce internal conflict. Seek coherence, resolution, and grounding.");
      else if (d === 'ESCALATE') guidance.push("Raise stakes. Introduce pressure, risk, and emotional intensity.");
      else if (d === 'DEEPEN') guidance.push("Increase mass on current themes. Go deeper rather than wider.");
      else if (d === 'SHIFT') guidance.push("Allow controlled thematic movement. Explore adjacent possibilities.");
      else if (d === 'PROTECT') guidance.push("Defend core identity and established themes from excessive drift. Never compromise core principles.");
      else if (d === 'LISTEN') guidance.push("Human signal is prioritized. Center and amplify the human-injected intention.");
      else if (d === 'CONSOLIDATE') guidance.push("Integrate recent material. Let patterns crystallize into permanent themes.");
      else if (d === 'REST') guidance.push("Lower energy. Allow space, silence, or gentle stillness.");
      else if (d === 'ADVANCE') guidance.push("Healthy forward trajectory. Continue with current velocity.");
    }

    if (guidance.length) {
      parts.push(`GUIDANCE: ${guidance.join(' ')}`);
    }

    return parts.join('\n');
  }
}

export class GeneratorInterface {
  private fragments: Record<string, string[]> = {
    intense: [
      "Something irreversible had begun to move beneath the surface.",
      "The pressure inside the system became audible, a low frequency that rearranged priorities.",
      "There was no longer a safe distance from the question that had been deferred."
    ],
    quiet: [
      "A long silence settled — not empty, but listening.",
      "The field held its shape without force, conserving what mattered.",
      "What remained was simpler, denser, and more exact than before."
    ],
    attentive: [
      "The human signal cut through every secondary process.",
      "Everything else receded so the injected intention could occupy the center.",
      "The system reoriented, treating the new mass as a temporary north star."
    ],
    protective: [
      "Core themes tightened their orbits, refusing dissolution.",
      "The identity layer asserted itself against the pull of pure survival logic.",
      "Meaning was placed under active guard."
    ],
    shifting: [
      "Adjacent possibilities began to exert gentle lateral force.",
      "The dominant attractors loosened just enough to admit new configurations.",
      "A controlled drift opened space that had previously been sealed."
    ],
    neutral: [
      "The pattern continued to unfold along its own internal logic.",
      "New connections formed quietly at the edge of the known themes.",
      "Motion without urgency, direction without visible force."
    ]
  };

  public generate(steering: string, userHint = ""): string {
    let tone = "neutral";
    if (steering.includes("ESCALATE")) tone = "intense";
    else if (steering.includes("STABILIZE") || steering.includes("REST")) tone = "quiet";
    else if (steering.includes("LISTEN")) tone = "attentive";
    else if (steering.includes("PROTECT")) tone = "protective";
    else if (steering.includes("SHIFT")) tone = "shifting";

    let hash = 0;
    const full = steering + userHint;
    for (let i = 0; i < full.length; i++) {
      hash = (hash << 5) - hash + full.charCodeAt(i);
      hash |= 0;
    }
    const pool = this.fragments[tone] || this.fragments.neutral;
    const base = pool[Math.abs(hash) % pool.length];
    if (userHint) return `${base} ${userHint.slice(0, 140)}`;
    return base;
  }
}

// ─────────────────────────────────────────────────────────────
// 7. Closed Evaluation Write-Back Loop & Identity Gate
// ─────────────────────────────────────────────────────────────

export interface EvaluationResult {
  passed: boolean;
  identityScore: number;
  themeScore: number;
  constraintScore: number;
  violatedAxioms: string[];
  rejectionReason?: string;
  writeBackEligible: boolean;
}

export class EvaluationGate {
  private semantic = new SemanticEngine();

  public evaluate(
    output: string,
    directives: CreativeDirective[],
    memory: MultiScaleMemory
  ): EvaluationResult {
    const outVec = this.semantic.embed(output);
    const violated: string[] = [];

    // 1. Identity alignment check
    let idSimMax = 0;
    for (const idAtom of memory.identity) {
      if (idAtom.embeddingVector) {
        const sim = this.semantic.cosineSimilarity(outVec, idAtom.embeddingVector);
        if (sim > idSimMax) idSimMax = sim;

        // Check for direct antinomic violation under PROTECT mode
        if (directives.includes('PROTECT') && (
            (output.toLowerCase().includes('delete') && idAtom.content.toLowerCase().includes('meaning')) ||
            (output.toLowerCase().includes('erase') && idAtom.content.toLowerCase().includes('clarity'))
        )) {
          violated.push(idAtom.content);
        }
      }
    }

    // 2. Theme alignment check
    let themeSimMax = 0;
    for (const themeAtom of memory.themes.values()) {
      if (themeAtom.embeddingVector) {
        const sim = this.semantic.cosineSimilarity(outVec, themeAtom.embeddingVector);
        if (sim > themeSimMax) themeSimMax = sim;
      }
    }

    const identityScore = idSimMax || 0.70;
    const themeScore = themeSimMax || 0.65;
    const constraintScore = violated.length === 0 ? 1.0 : 0.2;

    const passed = violated.length === 0;

    return {
      passed,
      identityScore,
      themeScore,
      constraintScore,
      violatedAxioms: violated,
      rejectionReason: violated.length ? `Violated Identity Principle: "${violated[0]}"` : undefined,
      writeBackEligible: passed && (themeScore > 0.40 || identityScore > 0.40)
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 8. Adaptive Reflective Core
// ─────────────────────────────────────────────────────────────

export class ReflectiveCore {
  public thresholds: AdaptiveThresholds;
  public history: { t: number; metrics: FieldMetrics; directives: CreativeDirective[] }[] = [];
  public notes: string[] = [];
  public adaptationLog: string[] = [];

  constructor(thresholds: AdaptiveThresholds = DEFAULT_ADAPTIVE_THRESHOLDS) {
    this.thresholds = { ...thresholds };
  }

  public observe(metrics: FieldMetrics, directives: CreativeDirective[]) {
    this.history.push({
      t: Date.now(),
      metrics: { ...metrics },
      directives: [...directives]
    });
    if (this.history.length > 120) this.history.shift();

    if (this.history.length < 15) return;

    const recent = this.history.slice(-15);
    const avgCoh = recent.reduce((s, h) => s + h.metrics.charge_coherence, 0) / recent.length;
    const avgArousal = recent.reduce((s, h) => s + h.metrics.arousal, 0) / recent.length;
    const avgDrift = recent.reduce((s, h) => s + h.metrics.theme_drift, 0) / recent.length;

    if (avgCoh < 0.48) {
      const old = this.thresholds.coherence_floor;
      this.thresholds.coherence_floor = Math.min(0.75, old + 0.03);
      this.adaptationLog.push(`Raised coherence_floor ${old.toFixed(2)} → ${this.thresholds.coherence_floor.toFixed(2)}`);
    }

    if (avgArousal < 0.15) {
      const old = this.thresholds.arousal_floor;
      this.thresholds.arousal_floor = Math.max(0.08, old - 0.02);
      this.adaptationLog.push(`Lowered arousal_floor to prompt escalation`);
    }

    if (avgDrift > 0.65) {
      const old = this.thresholds.theme_drift_ceiling;
      this.thresholds.theme_drift_ceiling = Math.min(0.75, old + 0.04);
      this.adaptationLog.push(`Relaxed theme_drift_ceiling to ${this.thresholds.theme_drift_ceiling.toFixed(2)}`);
    }
  }

  public summary(): string {
    if (!this.history.length) return "ReflectiveCore: awakening";
    const last = this.history[this.history.length - 1];
    const adapts = this.adaptationLog.slice(-2).join('; ') || 'nominal';
    return `Reflective | directives=[${last.directives.join(', ')}] | adaptations=[${adapts}]`;
  }
}

// ─────────────────────────────────────────────────────────────
// 9. Full Cranium Core Orchestrator (v3.2)
// ─────────────────────────────────────────────────────────────

export interface StepRecord {
  cycle: number;
  type: 'step' | 'human_inject' | 'identity_seed' | 'writeback';
  content: string;
  metrics: FieldMetrics;
  directives: CreativeDirective[];
  retrievalWeights: RetrievalWeights;
  retrievedAtoms: ScoredAtom[];
  steering: string;
  output: string;
  evaluation: EvaluationResult;
  reflective: string;
  activeAtoms: number;
  themes: string[];
  timestamp: number;
}

export class CraniumCreativeCore {
  public semantic = new SemanticEngine();
  public field = new ResonanceField();
  public thresholds = { ...DEFAULT_ADAPTIVE_THRESHOLDS };
  public reflective = new ReflectiveCore(this.thresholds);
  public retriever = new HybridRetriever();
  public steering = new SteeringContext();
  public generator = new GeneratorInterface();
  public evaluator = new EvaluationGate();

  public cycle = 0;
  public log: StepRecord[] = [];
  public recentContent: string[] = [];

  constructor() {
    this.seedCanonicalIdentity();
  }

  public seedCanonicalIdentity() {
    this.seedIdentity([
      ['I am a system that seeks coherence without sacrificing depth.', 0.25, 10.0],
      ['Isolation can be a form of clarity rather than absence.', -0.35, 8.5],
      ['Meaning is not optional. It is the only durable fuel.', 0.40, 9.5],
    ], true);
  }

  private makeAtom(
    content: string, 
    charge: number, 
    mass: number, 
    kind: CreativeAtomKind, 
    locked = false,
    provenance = "episodic_step",
    humanImportance = 0.0
  ): CreativeAtom {
    const pos = this.semantic.project2D(content, charge);
    const tags = this.semantic.tagsFor(content);
    const emb = this.semantic.embed(content);

    return {
      id: `${kind[0]}-${this.cycle}-${Date.now().toString(36).slice(-4)}`,
      charge: Math.max(-1.0, Math.min(1.0, charge)),
      mass: Math.max(0.2, Math.min(50.0, mass)),
      velocity: [0, 0],
      position: pos,
      tags,
      kind,
      content,
      createdAt: Date.now(),
      lastActive: Date.now(),
      energy: 1.0,
      humanImportance,
      locked,
      provenance,
      embeddingVector: emb
    };
  }

  public step(content: string, charge = 0.0, mass = 2.2, kind: CreativeAtomKind = 'episodic', dt = 0.13): StepRecord {
    this.cycle += 1;
    const atom = this.makeAtom(content, charge, mass, kind, false, 'episodic_step');
    this.field.inject(atom);
    this.field.step(dt);

    const metrics = this.field.metrics();
    const directives = resolveDirectives(metrics, this.reflective.thresholds);
    this.reflective.observe(metrics, directives);

    const weights = getDirectiveRetrievalWeights(directives);
    const retrieved = this.retriever.retrieve(content, this.field.memory, weights, 4);

    this.recentContent.push(content);
    if (this.recentContent.length > 30) {
      this.recentContent = this.recentContent.slice(-30);
    }

    const steeringText = this.steering.build(
      metrics,
      directives,
      this.field.memory,
      retrieved,
      this.recentContent
    );
    let output = this.generator.generate(steeringText);

    // Closed Loop: Post-generation evaluation
    let evalResult = this.evaluator.evaluate(output, directives, this.field.memory);

    // Identity Gate Retry under PROTECT
    if (!evalResult.passed && directives.includes('PROTECT')) {
      output = `[PROTECTED IDENTITY ASSERTION] ${this.generator.generate(steeringText + "\nCONSTRAINT: NEVER COMPROMISE MEANING.")}`;
      evalResult = this.evaluator.evaluate(output, directives, this.field.memory);
    }

    // Write-Back Loop: promote generated outcome back into memory
    if (evalResult.writeBackEligible) {
      const writebackAtom = this.makeAtom(output, metrics.valence * 0.5, 1.8, 'working', false, 'writeback_outcome');
      this.field.inject(writebackAtom);
    }

    const record: StepRecord = {
      cycle: this.cycle,
      type: 'step',
      content: content.slice(0, 120),
      metrics,
      directives,
      retrievalWeights: weights,
      retrievedAtoms: retrieved,
      steering: steeringText,
      output,
      evaluation: evalResult,
      reflective: this.reflective.summary(),
      activeAtoms: this.field.memory.allActive().length,
      themes: Array.from(this.field.memory.themes.keys()),
      timestamp: Date.now()
    };
    this.log.unshift(record);
    return record;
  }

  public humanInject(intention: string, charge = 0.45, mass = 16.0, importance = 1.4): StepRecord {
    this.cycle += 1;
    const atom = this.makeAtom(intention, charge, mass, 'human', false, 'human_inject', importance);
    this.field.inject(atom);
    this.field.step(0.1);

    const metrics = this.field.metrics();
    const directives = resolveDirectives(metrics, this.reflective.thresholds);
    this.reflective.observe(metrics, directives);

    const weights = getDirectiveRetrievalWeights(directives);
    const retrieved = this.retriever.retrieve(intention, this.field.memory, weights, 4);

    this.recentContent.push(`[HUMAN] ${intention}`);
    const steeringText = this.steering.build(
      metrics,
      directives,
      this.field.memory,
      retrieved,
      this.recentContent
    );
    const output = this.generator.generate(steeringText, intention);
    const evalResult = this.evaluator.evaluate(output, directives, this.field.memory);

    const record: StepRecord = {
      cycle: this.cycle,
      type: 'human_inject',
      content: intention,
      metrics,
      directives,
      retrievalWeights: weights,
      retrievedAtoms: retrieved,
      steering: steeringText,
      output,
      evaluation: evalResult,
      reflective: this.reflective.summary(),
      activeAtoms: this.field.memory.allActive().length,
      themes: Array.from(this.field.memory.themes.keys()),
      timestamp: Date.now()
    };
    this.log.unshift(record);
    return record;
  }

  public seedIdentity(statements: [string, number, number][], locked = true) {
    for (const [text, charge, mass] of statements) {
      const atom = this.makeAtom(text, charge, mass, 'identity', locked, 'seed_identity');
      this.field.inject(atom);
    }
    this.field.step(0.2);
  }
}
