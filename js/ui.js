// Rendering layer. Owns the DOM, never touches game rules or the network.

import { ARCHETYPES } from '../data/themes.js';
import { RUN_STATUS } from './engine.js';

const TIER_LABELS = {
  reussiteCritique: 'Reussite critique',
  reussiteFranche: 'Franche reussite',
  reussiteJuste: 'Reussite de justesse',
  echecJuste: 'Echec de justesse',
  echecLourd: 'Echec lourd',
  echecCritique: 'Echec critique'
};

const STAT_LABELS = {
  force: 'Force',
  arcane: 'Arcane',
  agilite: 'Agilite',
  esprit: 'Esprit'
};

function byId(elementId) {
  const element = document.getElementById(elementId);
  return element;
}

export function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach((node) => node.classList.remove('active'));
  byId(screenName).classList.add('active');
}

// Applies the palette of the day to the whole interface.
export function applyTheme(theme) {
  const root = document.documentElement.style;
  root.setProperty('--colorAccent', theme.palette.accent);
  root.setProperty('--colorBackground', theme.palette.background);
  root.setProperty('--colorPanel', theme.palette.panel);
  root.setProperty('--colorText', theme.palette.text);
}

export function setLoadingMessage(text) {
  byId('loadingMessage').textContent = text;
}

export function renderArchetypeChoices(selectedId, onSelect) {
  const container = byId('archetypeGrid');
  container.innerHTML = '';

  ARCHETYPES.forEach((archetype) => {
    const detail = Object.keys(archetype.modifiers)
      .filter((key) => archetype.modifiers[key] !== 0)
      .map((key) => `${STAT_LABELS[key]} ${archetype.modifiers[key] > 0 ? '+' : ''}${archetype.modifiers[key]}`)
      .join('  ');

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = archetype.name;
    if (archetype.id === selectedId) {
      button.classList.add('selected');
    }

    const note = document.createElement('small');
    note.textContent = detail;
    button.appendChild(note);
    button.addEventListener('click', () => onSelect(archetype.id));
    container.appendChild(button);
  });
}

export function renderHub(dungeon, profile, level, statusText, canPlay, playLabel) {
  byId('hubIdentity').textContent =
    `${profile.character.name} - ${profile.character.archetypeName} niveau ${level}`;
  byId('hubStreak').textContent = `Serie ${profile.streak}`;
  byId('hubQuestName').textContent = dungeon.questName;
  byId('hubThemeName').textContent = `${dungeon.theme.name} - ${dungeon.theme.subtitle}`;
  byId('hubObjective').textContent = `Objectif : ${dungeon.objective}`;
  byId('hubEntry').textContent = dungeon.entryText;
  byId('hubStatus').textContent = statusText;

  const playButton = byId('btnPlay');
  playButton.disabled = canPlay === false;
  playButton.textContent = playLabel;
}

export function renderGuilds(profile, onSelect, onRemove) {
  const container = byId('guildList');
  container.innerHTML = '';

  if (profile.guilds.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Aucune guilde. Inventez un code et partagez-le a vos amis.';
    container.appendChild(empty);
  }

  profile.guilds.forEach((code) => {
    const item = document.createElement('li');
    if (code === profile.activeGuild) {
      item.classList.add('self');
    }

    const select = document.createElement('button');
    select.type = 'button';
    select.textContent = code === profile.activeGuild ? `${code} (active)` : code;
    select.addEventListener('click', () => onSelect(code));
    item.appendChild(select);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Quitter';
    remove.addEventListener('click', () => onRemove(code));
    item.appendChild(remove);

    container.appendChild(item);
  });
}

export function renderLeaderboard(entries, userId, mode) {
  const container = byId('leaderboardList');
  container.innerHTML = '';

  if (entries.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Aucun score pour le moment.';
    container.appendChild(empty);
  }

  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    if (entry.userId === userId) {
      item.classList.add('self');
    }

    const rank = document.createElement('span');
    rank.className = 'rank';
    rank.textContent = `${index + 1}.`;
    item.appendChild(rank);

    const name = document.createElement('span');
    name.style.flex = '1';
    name.textContent = mode === 'global'
      ? `${entry.playerName || 'Anonyme'} [${entry.guildCode}]`
      : (entry.playerName || 'Anonyme');
    item.appendChild(name);

    const value = document.createElement('span');
    if (mode === 'season') {
      value.textContent = `${entry.total} pts / ${entry.days} j`;
    } else {
      value.textContent = `${entry.score} pts`;
    }
    item.appendChild(value);

    container.appendChild(item);
  });
}

export function renderRunHeader(run, dungeon) {
  byId('runRoomCounter').textContent = `Salle ${run.roomIndex + 1} / ${dungeon.rooms.length}`;
  byId('runStats').textContent = `${run.hitPoints} PV - butin ${run.loot}`;
  const ratio = Math.max(0, Math.round((run.hitPoints / run.maxHitPoints) * 100));
  byId('runHpFill').style.width = `${ratio}%`;
}

export function renderRoom(room, character, onChoose) {
  const body = byId('runBody');
  body.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h1');
  title.textContent = room.name;
  card.appendChild(title);

  const text = document.createElement('p');
  text.textContent = room.text;
  card.appendChild(text);

  if (room.twist) {
    const twist = document.createElement('p');
    twist.className = 'twist';
    twist.textContent = room.twist;
    card.appendChild(twist);
  }

  body.appendChild(card);

  room.options.forEach((option) => {
    const modifier = Number(character.modifiers[option.stat] || 0);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.textContent = option.label;

    const meta = document.createElement('span');
    meta.className = 'optionMeta';
    meta.textContent = `${STAT_LABELS[option.stat]} ${modifier >= 0 ? '+' : ''}${modifier}`
      + ` contre DD ${option.difficulty} - gain ${option.reward} - risque ${option.damage} PV`;
    button.appendChild(meta);

    button.addEventListener('click', () => onChoose(option));
    body.appendChild(button);
  });
}

export function renderOutcome(outcome, run, onContinue, continueLabel) {
  const body = byId('runBody');
  body.innerHTML = '';

  const panel = document.createElement('div');
  panel.className = outcome.isSuccess ? 'card outcome' : 'card outcome failure';

  const dice = document.createElement('div');
  dice.className = 'diceValue';
  dice.textContent = String(outcome.total);
  panel.appendChild(dice);

  const tier = document.createElement('div');
  tier.className = 'tier';
  tier.textContent = TIER_LABELS[outcome.tier] || outcome.tier;
  panel.appendChild(tier);

  const detail = document.createElement('p');
  detail.className = 'muted';
  detail.textContent = `1d20 [${outcome.naturalRoll}]`
    + ` ${outcome.modifier >= 0 ? '+' : ''}${outcome.modifier}`
    + `  |  butin ${outcome.lootGain > 0 ? `+${outcome.lootGain}` : '0'}`
    + `  |  degats ${outcome.damage > 0 ? `-${outcome.damage}` : '0'}`
    + `  |  ${run.hitPoints} PV restants`;
  panel.appendChild(detail);

  body.appendChild(panel);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'primary';
  next.textContent = continueLabel;
  next.addEventListener('click', onContinue);
  body.appendChild(next);
}

export function renderEnd(run, dungeon, shareText) {
  const survived = run.status === RUN_STATUS.cleared;
  byId('endTitle').textContent = survived ? 'Vous ressortez vivant' : 'Le donjon vous garde';
  byId('endSubtitle').textContent = `${dungeon.questName} - ${run.score} points`;

  byId('endReport').textContent = [
    `Salles franchies : ${run.roomsCleared} sur ${dungeon.rooms.length}`,
    `Butin amasse : ${run.loot}`,
    `Degats subis : ${run.damageTaken}`,
    `Gardien : ${run.guardianDefeated ? 'vaincu' : 'non vaincu'}`,
    `Critiques : ${run.criticals} reussites, ${run.fumbles} echecs`
  ].join('\n');

  byId('endShare').textContent = shareText;
}

export function setActiveTab(mode) {
  byId('btnTabDaily').classList.toggle('selected', mode === 'daily');
  byId('btnTabSeason').classList.toggle('selected', mode === 'season');
  byId('btnTabGlobal').classList.toggle('selected', mode === 'global');
}
