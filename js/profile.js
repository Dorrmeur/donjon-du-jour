// Local profile persistence: character, guild list, streak and resumable run.

const STORAGE_KEY = 'donjonDuJour.profile.v1';

function createDefaultProfile() {
  const defaultProfile = {
    character: null,
    guilds: [],
    activeGuild: '',
    lastPlayedKey: '',
    streak: 0,
    bestScore: 0,
    currentRun: null
  };

  return defaultProfile;
}

export function loadProfile() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  let profile = createDefaultProfile();

  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw);
      profile = Object.assign(createDefaultProfile(), parsed);
      profile.guilds = Array.isArray(profile.guilds) ? profile.guilds : [];
    } catch (error) {
      window.console.warn('Corrupted profile, falling back to defaults', error);
      profile = createDefaultProfile();
    }
  }

  return profile;
}

export function saveProfile(profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    window.console.warn('Unable to persist profile', error);
  }
}

// Returns the YYYY-MM-DD key of the day before the provided one.
function getPreviousKey(dailyKey) {
  const date = new Date(`${dailyKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const previousKey = `${year}-${month}-${day}`;

  return previousKey;
}

// Updates the consecutive days counter once a run is completed.
export function updateStreak(profile, dailyKey) {
  if (profile.lastPlayedKey === dailyKey) {
    // Already counted today, nothing to do.
    profile.streak = Math.max(1, profile.streak);
  } else if (profile.lastPlayedKey === getPreviousKey(dailyKey)) {
    profile.streak += 1;
  } else {
    profile.streak = 1;
  }

  profile.lastPlayedKey = dailyKey;
  return profile.streak;
}
