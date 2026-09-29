// Game rules engine: character sheet, dice resolution, run state and scoring.
// Pure logic, no DOM and no network access.

import { ARCHETYPES } from '../data/themes.js';

const BASE_HIT_POINTS = 20;
const HP_PER_LEVEL = 1;
const RUNS_PER_LEVEL = 3;
const GUARDIAN_BONUS = 25;
const CRITICAL_LOOT_BONUS = 15;

export const RUN_STATUS = {
  running: 'running',
  cleared: 'cleared',
  dead: 'dead'
};

function findArchetype(archetypeId) {
  const match = ARCHETYPES.filter((entry) => entry.id === archetypeId);
  const archetype = match.length > 0 ? match[0] : ARCHETYPES[0];
  return archetype;
}

// Level is capped so that veterans never crush newcomers on the leaderboard.
export function computeLevel(clearedRuns) {
  const level = Math.min(10, 1 + Math.floor(Number(clearedRuns || 0) / RUNS_PER_LEVEL));
  return level;
}

export function computeMaxHitPoints(clearedRuns) {
  const maxHitPoints = BASE_HIT_POINTS + (computeLevel(clearedRuns) - 1) * HP_PER_LEVEL;
  return maxHitPoints;
}

export function createCharacter(name, archetypeId) {
  const archetype = findArchetype(archetypeId);
  const character = {
    name: String(name || 'Anonyme').slice(0, 18),
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    modifiers: Object.assign({}, archetype.modifiers),
    clearedRuns: 0,
    totalRuns: 0
  };

  return character;
}

export function createRun(dungeon, character) {
  const maxHitPoints = computeMaxHitPoints(character.clearedRuns);
  const run = {
    dailyKey: dungeon.dailyKey,
    themeId: dungeon.themeId,
    questName: dungeon.questName,
    status: RUN_STATUS.running,
    roomIndex: 0,
    hitPoints: maxHitPoints,
    maxHitPoints,
    loot: 0,
    damageTaken: 0,
    roomsCleared: 0,
    criticals: 0,
    fumbles: 0,
    guardianDefeated: false,
    history: [],
    startedAt: new Date().toISOString()
  };

  return run;
}

function rollDie(faces) {
  const value = Math.floor(Math.random() * faces) + 1;
  return value;
}

// Resolves one option against its difficulty and qualifies the outcome.
export function resolveOption(option, character) {
  const naturalRoll = rollDie(20);
  const modifier = Number(character.modifiers[option.stat] || 0);
  const total = naturalRoll + modifier;
  const margin = total - option.difficulty;

  let tier = '';
  if (naturalRoll === 1) {
    tier = 'echecCritique';
  } else if (naturalRoll === 20) {
    tier = 'reussiteCritique';
  } else if (margin < -4) {
    tier = 'echecLourd';
  } else if (margin < 0) {
    tier = 'echecJuste';
  } else if (margin < 5) {
    tier = 'reussiteJuste';
  } else {
    tier = 'reussiteFranche';
  }

  const isSuccess = tier.startsWith('reussite');
  let lootGain = 0;
  let damage = 0;

  if (tier === 'reussiteCritique') {
    lootGain = option.reward + CRITICAL_LOOT_BONUS;
  } else if (tier === 'reussiteFranche') {
    lootGain = option.reward;
  } else if (tier === 'reussiteJuste') {
    lootGain = Math.round(option.reward * 0.6);
    damage = Math.ceil(option.damage / 2);
  } else if (tier === 'echecJuste') {
    lootGain = Math.round(option.reward * 0.2);
    damage = option.damage;
  } else if (tier === 'echecLourd') {
    damage = option.damage + 2;
  } else {
    damage = option.damage + 5;
  }

  const outcome = { naturalRoll, modifier, total, margin, tier, isSuccess, lootGain, damage };
  return outcome;
}

// Applies an outcome to the run and advances the cursor.
export function applyOutcome(run, dungeon, outcome) {
  const isGuardianRoom = run.roomIndex === dungeon.rooms.length - 1;

  run.hitPoints = Math.max(0, run.hitPoints - outcome.damage);
  run.damageTaken += outcome.damage;
  run.loot += outcome.lootGain;
  run.roomsCleared += 1;

  if (outcome.tier === 'reussiteCritique') {
    run.criticals += 1;
  } else if (outcome.tier === 'echecCritique') {
    run.fumbles += 1;
  }

  run.history.push({
    room: run.roomIndex,
    stat: outcome.stat || '',
    roll: outcome.naturalRoll,
    total: outcome.total,
    tier: outcome.tier
  });

  if (isGuardianRoom && outcome.isSuccess) {
    run.guardianDefeated = true;
  }

  if (run.hitPoints <= 0) {
    run.status = RUN_STATUS.dead;
  } else if (isGuardianRoom) {
    run.status = RUN_STATUS.cleared;
  } else {
    run.roomIndex += 1;
  }

  run.score = computeScore(run);
  return run;
}

export function computeScore(run) {
  const base = run.roomsCleared * 10;
  const guardian = run.guardianDefeated ? GUARDIAN_BONUS : 0;
  const critical = run.criticals * 5;
  const penalty = run.damageTaken * 2;
  const survival = run.status === RUN_STATUS.cleared ? Math.round(run.hitPoints * 1.5) : 0;
  const score = Math.max(0, base + run.loot + guardian + critical + survival - penalty);

  return score;
}

// Builds the emoji summary players paste into their group chat.
export function buildShareText(run, dungeon) {
  const icons = {
    reussiteCritique: '\u2B50',
    reussiteFranche: '\uD83D\uDFE9',
    reussiteJuste: '\uD83D\uDFE8',
    echecJuste: '\uD83D\uDFE7',
    echecLourd: '\uD83D\uDFE5',
    echecCritique: '\uD83D\uDC80'
  };

  const strip = run.history.map((entry) => icons[entry.tier] || '\u2B1B').join('');
  const ending = run.status === RUN_STATUS.cleared ? 'Sorti vivant' : 'Mort dans le donjon';
  const shareText = [
    `${dungeon.questName} - ${dungeon.dailyKey}`,
    `${dungeon.theme.name}`,
    strip,
    `${ending} - ${run.roomsCleared}/${dungeon.rooms.length} salles - ${run.score} pts`
  ].join('\n');

  return shareText;
}
