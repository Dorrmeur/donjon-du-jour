// Deterministic pseudo random generator. The daily seed guarantees that every
// player faces the exact same dungeon without any server side generation.

const EPOCH_DAY_MS = 86400000;

// Mulberry32: compact, fast and stable across browsers.
function createGenerator(seed) {
  let state = seed >>> 0;

  const generator = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const result = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    return result;
  };

  return generator;
}

// Converts a string such as "2026-09-29" into a stable 32 bit integer.
function hashString(text) {
  let hash = 2166136261;

  Array.from(String(text)).forEach((character) => {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });

  const result = hash >>> 0;
  return result;
}

// Returns the current puzzle date as YYYY-MM-DD in the player local timezone.
export function getDailyKey(referenceDate) {
  const now = referenceDate instanceof Date ? referenceDate : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const key = `${year}-${month}-${day}`;
  return key;
}

// Absolute day index since epoch, used for theme rotation.
export function getDayIndex(dailyKey) {
  const parsed = new Date(`${dailyKey}T00:00:00Z`);
  const index = Math.floor(parsed.getTime() / EPOCH_DAY_MS);
  return index;
}

// Builds a seeded toolbox bound to one specific day.
export function createDailyRandom(dailyKey, salt) {
  const generator = createGenerator(hashString(`${dailyKey}#${salt || 'main'}`));

  const toolbox = {
    next: () => generator(),
    range: (minimum, maximum) => Math.floor(generator() * (maximum - minimum + 1)) + minimum,
    pick: (entries) => entries[Math.floor(generator() * entries.length)],
    chance: (probability) => generator() < probability,
    shuffle: (entries) => {
      const copy = entries.slice();
      let index = copy.length - 1;

      while (index > 0) {
        const swapIndex = Math.floor(generator() * (index + 1));
        const memory = copy[index];
        copy[index] = copy[swapIndex];
        copy[swapIndex] = memory;
        index -= 1;
      }

      return copy;
    }
  };

  return toolbox;
}
