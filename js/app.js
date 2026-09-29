// Orchestration layer: wires profile, generator, engine, network and rendering.

import { getDailyKey } from './rng.js';
import { buildDailyDungeon } from './generator.js';
import {
  createCharacter, createRun, resolveOption, applyOutcome,
  computeLevel, buildShareText, RUN_STATUS
} from './engine.js';
import { loadProfile, saveProfile, updateStreak } from './profile.js';
import {
  ensureSignedIn, getUserId, normalizeGuildCode, isValidGuildCode,
  hasPlayedToday, submitScore, fetchDailyLeaderboard, fetchSeasonLeaderboard
} from './firebase.js';
import * as ui from './ui.js';

const SEASON_LENGTH_DAYS = 30;

// Module private members.
let m_profile = loadProfile();
let m_dungeon = null;
let m_run = null;
let m_selectedArchetype = 'guerrier';
let m_seasonTab = false;
let m_alreadySubmitted = false;

function persist() {
  saveProfile(m_profile);
}

function getSeasonStartKey() {
  const date = new Date();
  date.setDate(date.getDate() - SEASON_LENGTH_DAYS);
  const startKey = getDailyKey(date);
  return startKey;
}

async function refreshLeaderboard() {
  if (m_profile.activeGuild.length === 0) {
    ui.renderLeaderboard([], getUserId(), m_seasonTab);
  } else if (m_seasonTab) {
    const entries = await fetchSeasonLeaderboard(m_profile.activeGuild, getSeasonStartKey());
    ui.renderLeaderboard(entries, getUserId(), true);
  } else {
    const entries = await fetchDailyLeaderboard(m_profile.activeGuild, m_dungeon.dailyKey);
    ui.renderLeaderboard(entries, getUserId(), false);
  }
}

function buildHubStatus() {
  let statusText = '';

  if (m_profile.activeGuild.length === 0) {
    statusText = 'Aucune guilde active : vous jouez hors classement.';
  } else if (m_alreadySubmitted) {
    statusText = `Donjon du jour deja tente pour la guilde ${m_profile.activeGuild}.`
      + ' Revenez demain pour un nouveau lieu.';
  } else {
    statusText = `Guilde active : ${m_profile.activeGuild}. Une seule tentative par jour.`;
  }

  return statusText;
}

async function showHub() {
  const hasRunInProgress = m_run !== null && m_run.status === RUN_STATUS.running;
  const canPlay = hasRunInProgress || m_alreadySubmitted === false;
  const playLabel = hasRunInProgress ? 'Reprendre la descente' : 'Descendre dans le donjon';

  ui.renderHub(
    m_dungeon,
    m_profile,
    computeLevel(m_profile.character.clearedRuns),
    buildHubStatus(),
    canPlay,
    playLabel
  );

  ui.renderGuilds(m_profile, onSelectGuild, onRemoveGuild);
  ui.setActiveTab(m_seasonTab);
  ui.showScreen('screenHub');
  await refreshLeaderboard();
}

function renderCurrentRoom() {
  const room = m_dungeon.rooms[m_run.roomIndex];
  ui.renderRunHeader(m_run, m_dungeon);
  ui.renderRoom(room, m_profile.character, onChooseOption);
}

function onChooseOption(option) {
  const outcome = resolveOption(option, m_profile.character);
  applyOutcome(m_run, m_dungeon, outcome);

  m_profile.currentRun = m_run;
  persist();

  ui.renderRunHeader(m_run, m_dungeon);

  const isOver = m_run.status !== RUN_STATUS.running;
  const label = isOver ? 'Voir le bilan' : 'Poursuivre';
  ui.renderOutcome(outcome, m_run, () => {
    if (isOver) {
      finishRun();
    } else {
      renderCurrentRoom();
    }
  }, label);
}

async function finishRun() {
  m_profile.character.totalRuns += 1;
  if (m_run.status === RUN_STATUS.cleared) {
    m_profile.character.clearedRuns += 1;
  }
  m_profile.bestScore = Math.max(m_profile.bestScore, m_run.score);
  updateStreak(m_profile, m_dungeon.dailyKey);
  m_profile.currentRun = null;
  persist();

  ui.renderEnd(m_run, m_dungeon, buildShareText(m_run, m_dungeon));
  ui.showScreen('screenEnd');

  if (m_profile.activeGuild.length > 0 && m_alreadySubmitted === false) {
    const result = await submitScore(m_profile.activeGuild, m_dungeon.dailyKey, {
      playerName: m_profile.character.name,
      archetypeName: m_profile.character.archetypeName,
      themeId: m_dungeon.themeId,
      score: m_run.score,
      roomsCleared: m_run.roomsCleared,
      survived: m_run.status === RUN_STATUS.cleared
    });

    m_alreadySubmitted = result.ok;
  }
}

function startRun() {
  const hasRunInProgress = m_profile.currentRun !== null
    && m_profile.currentRun.dailyKey === m_dungeon.dailyKey
    && m_profile.currentRun.status === RUN_STATUS.running;

  m_run = hasRunInProgress ? m_profile.currentRun : createRun(m_dungeon, m_profile.character);
  m_profile.currentRun = m_run;
  persist();

  ui.showScreen('screenRun');
  renderCurrentRoom();
}

async function onSelectGuild(code) {
  m_profile.activeGuild = code;
  persist();
  m_alreadySubmitted = await hasPlayedToday(code, m_dungeon.dailyKey);
  await showHub();
}

async function onRemoveGuild(code) {
  m_profile.guilds = m_profile.guilds.filter((entry) => entry !== code);
  if (m_profile.activeGuild === code) {
    m_profile.activeGuild = m_profile.guilds.length > 0 ? m_profile.guilds[0] : '';
  }
  persist();

  if (m_profile.activeGuild.length > 0) {
    m_alreadySubmitted = await hasPlayedToday(m_profile.activeGuild, m_dungeon.dailyKey);
  } else {
    m_alreadySubmitted = false;
  }

  await showHub();
}

async function onJoinGuild() {
  const field = document.getElementById('inputGuildCode');
  const code = normalizeGuildCode(field.value);

  if (isValidGuildCode(code) === false) {
    field.value = '';
    field.placeholder = 'Exactement 5 lettres';
  } else {
    if (m_profile.guilds.includes(code) === false) {
      m_profile.guilds.push(code);
    }
    field.value = '';
    await onSelectGuild(code);
  }
}

function onCreateCharacter() {
  const nameField = document.getElementById('inputPlayerName');
  const name = nameField.value.trim();

  if (name.length === 0) {
    nameField.placeholder = 'Un nom est necessaire';
  } else {
    m_profile.character = createCharacter(name, m_selectedArchetype);
    persist();
    showHub();
  }
}

function onCopyShare() {
  const text = document.getElementById('endShare').textContent;
  const button = document.getElementById('btnCopyShare');

  navigator.clipboard.writeText(text)
    .then(() => { button.textContent = 'Copie'; })
    .catch(() => { button.textContent = 'Copie impossible'; });
}

function bindEvents() {
  document.getElementById('btnCreateCharacter').addEventListener('click', onCreateCharacter);
  document.getElementById('btnJoinGuild').addEventListener('click', onJoinGuild);
  document.getElementById('btnPlay').addEventListener('click', startRun);
  document.getElementById('btnCopyShare').addEventListener('click', onCopyShare);
  document.getElementById('btnBackToHub').addEventListener('click', showHub);

  document.getElementById('btnTabDaily').addEventListener('click', async () => {
    m_seasonTab = false;
    ui.setActiveTab(false);
    await refreshLeaderboard();
  });

  document.getElementById('btnTabSeason').addEventListener('click', async () => {
    m_seasonTab = true;
    ui.setActiveTab(true);
    await refreshLeaderboard();
  });

  document.getElementById('inputGuildCode').addEventListener('input', (event) => {
    event.target.value = normalizeGuildCode(event.target.value);
  });
}

function refreshArchetypeChoices() {
  ui.renderArchetypeChoices(m_selectedArchetype, (archetypeId) => {
    m_selectedArchetype = archetypeId;
    refreshArchetypeChoices();
  });
}

async function bootstrap() {
  try {
    bindEvents();

    m_dungeon = buildDailyDungeon(getDailyKey());
    ui.applyTheme(m_dungeon.theme);

    ui.setLoadingMessage('Ouverture du portail...');
    await ensureSignedIn();

    // Resume a run only if it belongs to the current day.
    if (m_profile.currentRun !== null && m_profile.currentRun.dailyKey !== m_dungeon.dailyKey) {
      m_profile.currentRun = null;
      persist();
    }
    m_run = m_profile.currentRun;

    if (m_profile.activeGuild.length > 0) {
      m_alreadySubmitted = await hasPlayedToday(m_profile.activeGuild, m_dungeon.dailyKey);
    }

    if (m_profile.character === null) {
      refreshArchetypeChoices();
      ui.showScreen('screenSetup');
    } else {
      await showHub();
    }
  } catch (error) {
    window.console.error('Bootstrap failure', error);
    ui.setLoadingMessage(`Erreur de demarrage : ${error.message}`);
  }
}

bootstrap();
