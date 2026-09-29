// Daily dungeon builder. Fully deterministic: the same date always produces
// the same dungeon on every device, without any server side generation.

import { createDailyRandom, getDayIndex } from './rng.js';
import { THEMES, TWISTS, QUEST_PREFIXES, getThemeForDay } from '../data/themes.js';

const STAT_KEYS = ['force', 'arcane', 'agilite', 'esprit'];
const PHASE_EXPLORATION = 'exploration';

function buildQuestName(random, theme) {
  const questName = `${random.pick(QUEST_PREFIXES)} ${random.pick(theme.questNouns)}`;
  return questName;
}

function buildOption(random, theme, statKey, tier) {
  // Difficulty scales with depth, tuned so that a matching archetype stays favoured.
  const baseDifficulty = 9 + tier;
  const isRisky = random.chance(0.35);

  const option = {
    stat: statKey,
    label: theme.flavors[statKey],
    difficulty: baseDifficulty + (isRisky ? 3 : 0),
    reward: isRisky ? random.range(18, 28) : random.range(8, 15),
    damage: isRisky ? random.range(5, 8) : random.range(2, 5)
  };

  return option;
}

function buildRoom(random, theme, index, tier) {
  const availableStats = random.shuffle(STAT_KEYS);
  const optionCount = random.chance(0.45) ? 3 : 2;
  const kinds = ['combat', 'fouille', 'piege', 'rencontre'];
  const kind = random.pick(kinds);

  const descriptions = {
    combat: `Vous tombez sur ${random.pick(theme.enemies)}. Aucun repli possible.`,
    fouille: 'La salle a deja ete visitee, mais quelque chose y a ete laisse. Volontairement.',
    piege: 'Le sol n\'est pas d\'aplomb. Un mecanisme attend sous vos pieds depuis longtemps.',
    rencontre: 'Une silhouette vous attend, assise, comme si votre venue etait prevue.'
  };

  const room = {
    index,
    phase: PHASE_EXPLORATION,
    kind,
    name: random.pick(theme.roomNames),
    text: descriptions[kind],
    loot: random.pick(theme.loot),
    options: availableStats.slice(0, optionCount).map((statKey) => buildOption(random, theme, statKey, tier))
  };

  return room;
}

function buildGuardianRoom(random, theme, tier) {
  const room = {
    index: -1,
    phase: 'gardien',
    kind: 'gardien',
    name: 'Le Coeur du Lieu',
    text: `Face a vous se tient ${theme.guardian}.`,
    loot: random.pick(theme.loot),
    options: random.shuffle(STAT_KEYS).slice(0, 3).map((statKey) => {
      const option = buildOption(random, theme, statKey, tier + 2);
      option.reward += 25;
      return option;
    })
  };

  return room;
}

// Main entry point. Returns the complete dungeon for a given YYYY-MM-DD key.
export function buildDailyDungeon(dailyKey) {
  const dayIndex = getDayIndex(dailyKey);
  const theme = getThemeForDay(dayIndex);
  const random = createDailyRandom(dailyKey, 'dungeon');

  const roomCount = random.range(5, 8);
  const rooms = [];
  let cursor = 0;

  while (cursor < roomCount) {
    const tier = Math.floor((cursor / roomCount) * 5);
    rooms.push(buildRoom(random, theme, cursor, tier));
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
