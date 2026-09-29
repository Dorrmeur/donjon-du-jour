// Daily dungeon builder. Fully deterministic: the same date always produces
// the same dungeon on every device, without any server side generation.

import { createDailyRandom, getDayIndex } from './rng.js';
import { TWISTS, QUEST_PREFIXES, getThemeForDay } from '../data/themes.js';
import { SITUATIONS, THEME_LEXICON } from '../data/situations.js';

const STAT_KEYS = ['force', 'arcane', 'agilite', 'esprit'];
const ROOM_KINDS = ['combat', 'fouille', 'piege', 'rencontre'];

// Picks a stable value for every token used by the current situation.
function buildTokens(random, theme) {
  const lexicon = THEME_LEXICON[theme.id] || THEME_LEXICON.crypte;
  const tokens = {
    enemy: random.pick(theme.enemies),
    guardian: theme.guardian,
    hazard: random.pick(lexicon.hazard),
    container: random.pick(lexicon.container),
    local: random.pick(lexicon.local),
    door: random.pick(lexicon.door)
  };

  return tokens;
}

function applyTokens(text, tokens) {
  const resolved = String(text).replace(/\{(\w+)\}/g, (whole, key) => {
    const replacement = tokens[key] !== undefined ? tokens[key] : whole;
    return replacement;
  });

  return resolved;
}

// Capitalises a sentence that may start with an injected token.
function capitalise(text) {
  const result = text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  return result;
}

function buildOption(random, situation, statKey, tokens, tier) {
  // Difficulty scales with depth. Risky options trade safety for reward.
  const isRisky = random.chance(0.35);
  const option = {
    stat: statKey,
    label: applyTokens(situation.actions[statKey], tokens),
    difficulty: 9 + tier + (isRisky ? 3 : 0),
    reward: isRisky ? random.range(18, 28) : random.range(8, 15),
    damage: isRisky ? random.range(5, 8) : random.range(2, 5)
  };

  return option;
}

function buildRoom(random, theme, index, tier, usedNames) {
  const kind = random.pick(ROOM_KINDS);
  const situation = random.pick(SITUATIONS[kind]);
  const tokens = buildTokens(random, theme);

  // Favour a room name that has not been used yet during this run.
  const freeNames = theme.roomNames.filter((name) => usedNames.includes(name) === false);
  const namePool = freeNames.length > 0 ? freeNames : theme.roomNames;
  const roomName = random.pick(namePool);
  usedNames.push(roomName);

  // Two or three approaches, always drawn from the situation itself.
  const optionCount = random.chance(0.45) ? 3 : 2;
  const chosenStats = random.shuffle(STAT_KEYS).slice(0, optionCount);

  const room = {
    index,
    kind,
    name: roomName,
    text: capitalise(applyTokens(situation.text, tokens)),
    loot: random.pick(theme.loot),
    options: chosenStats.map((statKey) => buildOption(random, situation, statKey, tokens, tier))
  };

  return room;
}

function buildGuardianRoom(random, theme, tier) {
  const situation = random.pick(SITUATIONS.gardien);
  const tokens = buildTokens(random, theme);
  const chosenStats = random.shuffle(STAT_KEYS).slice(0, 3);

  const room = {
    index: -1,
    kind: 'gardien',
    name: 'Le Coeur du Lieu',
    text: capitalise(applyTokens(situation.text, tokens)),
    loot: random.pick(theme.loot),
    options: chosenStats.map((statKey) => {
      const option = buildOption(random, situation, statKey, tokens, tier);
      option.reward += 25;
      return option;
    })
  };

  return room;
}

function buildQuestName(random, theme) {
  const questName = `${random.pick(QUEST_PREFIXES)} ${random.pick(theme.questNouns)}`;
  return questName;
}

// Main entry point. Returns the complete dungeon for a given YYYY-MM-DD key.
export function buildDailyDungeon(dailyKey) {
  const dayIndex = getDayIndex(dailyKey);
  const theme = getThemeForDay(dayIndex);
  const random = createDailyRandom(dailyKey, 'dungeon');

  const roomCount = random.range(5, 8);
  const usedNames = [];
  const rooms = [];
  let cursor = 0;

  while (cursor < roomCount) {
    const tier = Math.floor((cursor / roomCount) * 5);
    rooms.push(buildRoom(random, theme, cursor, tier, usedNames));
    cursor += 1;
  }

  // The twist lands two rooms before the guardian to keep the tension rising.
  const twist = random.pick(TWISTS);
  const twistIndex = Math.max(0, rooms.length - 2);
  rooms[twistIndex].twist = twist.text;

  rooms.push(buildGuardianRoom(random, theme, 5));
  rooms.forEach((room, position) => { room.index = position; });

  const dungeon = {
    dailyKey,
    dayIndex,
    themeId: theme.id,
    theme,
    questName: buildQuestName(random, theme),
    objective: random.pick(theme.objectives),
    entryText: theme.entry,
    twistId: twist.id,
    rooms
  };

  return dungeon;
}

// Debug helper: prints a readable summary of the day in the console.
export function describeDungeon(dungeon) {
  const lines = [
    `=== ${dungeon.questName} ===`,
    `${dungeon.theme.name} (${dungeon.theme.subtitle}) - ${dungeon.dailyKey}`,
    `Objectif: ${dungeon.objective}`,
    '',
    dungeon.entryText,
    ''
  ];

  dungeon.rooms.forEach((room) => {
    lines.push(`[${room.index + 1}] ${room.name} (${room.kind})`);
    lines.push(`    ${room.text}`);
    room.options.forEach((option) => {
      lines.push(`    - ${option.stat.toUpperCase()} DD${option.difficulty} : ${option.label}`
        + ` (gain ${option.reward}, risque ${option.damage} PV)`);
    });
    if (room.twist) {
      lines.push(`    >>> RETOURNEMENT: ${room.twist}`);
    }
    lines.push('');
  });

  const summary = lines.join('\n');
  return summary;
}
