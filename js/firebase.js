// Network layer: anonymous authentication, guild membership and leaderboards.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, doc, setDoc, getDoc, collection, query, where,
  orderBy, limit, getDocs, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import { FIREBASE_CONFIG } from './firebase-config.js';

const SCORES_COLLECTION = 'scores';
const GUILD_PATTERN = /^[A-Z]{5}$/;

const m_app = initializeApp(FIREBASE_CONFIG);
const m_auth = getAuth(m_app);
const m_db = getFirestore(m_app);

let m_userId = '';

// Signs the player in anonymously and resolves with a stable user id.
export function ensureSignedIn() {
  const promise = new Promise((resolve, reject) => {
    onAuthStateChanged(m_auth, (user) => {
      if (user !== null) {
        m_userId = user.uid;
        resolve(user.uid);
      }
    });

    signInAnonymously(m_auth).catch((error) => reject(error));
  });

  return promise;
}

export function getUserId() {
  return m_userId;
}

export function normalizeGuildCode(rawCode) {
  const code = String(rawCode || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
  return code;
}

export function isValidGuildCode(code) {
  const valid = GUILD_PATTERN.test(String(code || ''));
  return valid;
}

function buildScoreId(guildCode, userId, dailyKey) {
  const scoreId = `${guildCode}_${userId}_${dailyKey}`;
  return scoreId;
}

// Checks whether the player already submitted a run for that day.
export async function hasPlayedToday(guildCode, dailyKey) {
  const reference = doc(m_db, SCORES_COLLECTION, buildScoreId(guildCode, m_userId, dailyKey));
  let played = false;

  try {
    const snapshot = await getDoc(reference);
    played = snapshot.exists();
  } catch (error) {
    window.console.warn('Unable to check daily entry', error);
  }

  return played;
}

// Writes the run result. Firestore rules forbid updates, so a score is final.
export async function submitScore(guildCode, dailyKey, payload) {
  const reference = doc(m_db, SCORES_COLLECTION, buildScoreId(guildCode, m_userId, dailyKey));
  const record = {
    guildCode,
    dailyKey,
    userId: m_userId,
    playerName: String(payload.playerName || 'Anonyme').slice(0, 18),
    archetypeName: String(payload.archetypeName || ''),
    themeId: String(payload.themeId || ''),
    score: Math.max(0, Math.round(Number(payload.score) || 0)),
    roomsCleared: Number(payload.roomsCleared) || 0,
    survived: payload.survived === true,
    createdAt: serverTimestamp()
  };

  let result = { ok: false, message: '' };

  try {
    await setDoc(reference, record);
    result = { ok: true, message: '' };
  } catch (error) {
    result = { ok: false, message: error.message };
  }

  return result;
}

export async function fetchDailyLeaderboard(guildCode, dailyKey) {
  const scoresQuery = query(
    collection(m_db, SCORES_COLLECTION),
    where('guildCode', '==', guildCode),
    where('dailyKey', '==', dailyKey),
    orderBy('score', 'desc'),
    limit(50)
  );

  let entries = [];

  try {
    const snapshot = await getDocs(scoresQuery);
    entries = snapshot.docs.map((item) => item.data());
  } catch (error) {
    window.console.warn('Unable to load daily leaderboard', error);
  }

  return entries;
}

// Aggregates the last thirty days into a season ranking, computed client side.
export async function fetchSeasonLeaderboard(guildCode, sinceKey) {
  const scoresQuery = query(
    collection(m_db, SCORES_COLLECTION),
    where('guildCode', '==', guildCode),
    where('dailyKey', '>=', sinceKey),
    orderBy('dailyKey', 'desc'),
    limit(1000)
  );

  const totals = new Map();
  let entries = [];

  try {
    const snapshot = await getDocs(scoresQuery);

    snapshot.docs.forEach((item) => {
      const data = item.data();
      const current = totals.get(data.userId) || {
        userId: data.userId,
        playerName: data.playerName,
        total: 0,
        days: 0,
        best: 0
      };

      current.playerName = data.playerName;
      current.total += Number(data.score) || 0;
      current.days += 1;
      current.best = Math.max(current.best, Number(data.score) || 0);
      totals.set(data.userId, current);
    });

    entries = Array.from(totals.values()).sort((left, right) => right.total - left.total);
  } catch (error) {
    window.console.warn('Unable to load season leaderboard', error);
  }

  return entries;
}

// All time top scores across every guild. Single field ordering needs no index.
export async function fetchGlobalLeaderboard() {
  const scoresQuery = query(
    collection(m_db, SCORES_COLLECTION),
    orderBy('score', 'desc'),
    limit(10)
  );

  let entries = [];

  try {
    const snapshot = await getDocs(scoresQuery);
    entries = snapshot.docs.map((item) => item.data());
  } catch (error) {
    window.console.warn('Unable to load global leaderboard', error);
  }

  return entries;
}
