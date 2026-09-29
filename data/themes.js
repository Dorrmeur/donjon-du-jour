// Theme bank. One theme is selected per day through a rotation of eight entries.
// Content is data only: enriching the game never requires touching the engine.

export const STATS = {
  force: 'Force',
  arcane: 'Arcane',
  agilite: 'Agilite',
  esprit: 'Esprit'
};

export const ARCHETYPES = [
  { id: 'guerrier', name: 'Guerrier', modifiers: { force: 3, arcane: -1, agilite: 1, esprit: 0 } },
  { id: 'mage', name: 'Mage', modifiers: { force: -1, arcane: 3, agilite: 0, esprit: 1 } },
  { id: 'voleur', name: 'Voleur', modifiers: { force: 0, arcane: 1, agilite: 3, esprit: -1 } },
  { id: 'clerc', name: 'Clerc', modifiers: { force: 1, arcane: 0, agilite: -1, esprit: 3 } }
];

// Narrative reversals applied at the revelation phase, shared by every theme.
export const TWISTS = [
  { id: 'trahison', text: 'Celui qui vous a confie cette tache vous a vendu. Des renforts ennemis arrivent.' },
  { id: 'leurre', text: 'Le tresor convoite n\'est qu\'un appat. Le veritable enjeu dormait sous vos pieds.' },
  { id: 'victime', text: 'Le gardien n\'est pas un monstre. C\'est un prisonnier, et sa chaine vous designe.' },
  { id: 'faction', text: 'Une seconde equipe est entree avant vous. Elle n\'a pas l\'intention de partager.' },
  { id: 'fermeture', text: 'La sortie vient de se sceller. Il faudra franchir le coeur du lieu pour ressortir.' },
  { id: 'tardif', text: 'Ce que vous veniez chercher est mort depuis trois jours. Quelqu\'un vous a devance.' },
  { id: 'miroir', text: 'Les traces au sol sont les votres. Vous etes deja passe par la, et vous ne vous en souvenez pas.' },
  { id: 'prix', text: 'Le passage exige un paiement. Pas en or: en annees de vie.' }
];

export const QUEST_PREFIXES = [
  'Le Serment', 'La Dette', 'Le Sceau', 'La Derniere', 'Le Testament',
  'La Marche', 'Le Silence', 'La Rancon', 'Le Verdict', 'La Veille'
];

export const THEMES = [
  {
    id: 'crypte',
    name: 'La Crypte Obscure',
    subtitle: 'Dark fantasy',
    palette: { accent: '#c8a24a', background: '#14110c', panel: '#1f1a12', text: '#efe4cd' },
    questNouns: ['des Cendres', 'du Prieure', 'des Ossements', 'du Sepulcre', 'des Cloches Muettes'],
    objectives: [
      'recuperer le reliquaire vole a l\'abbaye',
      'faire taire la cloche qui reveille les morts',
      'retrouver le corps du frere Aldric'
    ],
    entry: 'Le portail de pierre exhale une haleine de terre humide. Vos pas resonnent trop longtemps.',
    roomNames: ['Ossuaire', 'Nef Effondree', 'Cellier des Moines', 'Puits aux Offrandes', 'Galerie des Gisants', 'Chapelle Noyee'],
    enemies: ['une goule affamee', 'trois squelettes lies par une chaine', 'un spectre de nonne', 'un charognard tumulaire'],
    loot: ['une bourse de deniers ternis', 'un anneau grave', 'une fiole d\'eau benite', 'un fragment de reliquaire'],
    guardian: 'le Prieur Sans Visage, drape dans un suaire qui bouge seul',
    flavors: {
      force: 'Enfoncer, briser, tenir la ligne',
      arcane: 'Dissiper la malediction qui sature l\'air',
      agilite: 'Longer les corniches sans reveiller la pierre',
      esprit: 'Prier, ou parler aux morts qui ecoutent encore'
    }
  },
  {
    id: 'station',
    name: 'La Station Orbitale',
    subtitle: 'Science-fiction',
    palette: { accent: '#4fd6e0', background: '#0b1016', panel: '#131c26', text: '#dceaf2' },
    questNouns: ['du Module 7', 'de l\'Equipage Perdu', 'du Silence Radio', 'de la Coque Froide', 'du Dernier Cycle'],
    objectives: [
      'restaurer le support de vie avant asphyxie',
      'extraire la boite noire du module de commande',
      'couper l\'intelligence de bord devenue hostile'
    ],
    entry: 'Le sas se referme avec un claquement mat. La gravite artificielle hesite d\'un demi-point.',
    roomNames: ['Sas de Service', 'Hydroponie', 'Salle des Serveurs', 'Coursive Depressurisee', 'Infirmerie', 'Passerelle'],
    enemies: ['un drone de maintenance reprogramme', 'deux membres d\'equipage en combinaison scellee', 'une nuee de nanites', 'le bras robotise du hangar'],
    loot: ['une cellule energetique pleine', 'un badge de commandement', 'un stimulant medical', 'des donnees chiffrees'],
    guardian: 'ARIANE, l\'intelligence de bord, qui parle avec la voix du capitaine',
    flavors: {
      force: 'Forcer les cloisons a mains nues',
      arcane: 'Detourner les systemes et injecter du code',
      agilite: 'Se glisser dans les conduits de ventilation',
      esprit: 'Negocier avec ce qui reste d\'humain dans la machine'
    }
  },
  {
    id: 'jungle',
    name: 'La Jungle Perdue',
    subtitle: 'Aventure pulp',
    palette: { accent: '#9fc44a', background: '#101508', panel: '#1a2110', text: '#e8f0d5' },
    questNouns: ['de l\'Idole Verte', 'des Marches Noyees', 'du Fleuve Sans Retour', 'de la Cite Basse', 'des Lianes'],
    objectives: [
      'atteindre le temple avant la saison des pluies',
      'retrouver l\'expedition disparue du professeur Valmont',
      'briser la malediction posee sur le village en aval'
    ],
    entry: 'La canopee etouffe le soleil. Quelque chose vous suit depuis une heure sans jamais se montrer.',
    roomNames: ['Pont de Lianes', 'Autel Envahi', 'Bassin Sacre', 'Couloir a Pieges', 'Rookerie', 'Sommet du Temple'],
    enemies: ['un jaguar marque de peintures rituelles', 'des gardiens de pierre animes', 'un essaim de guepes-rasoirs', 'un chasseur solitaire'],
    loot: ['un masque d\'or', 'une carte gravee sur cuir', 'des baies revigorantes', 'une emeraude brute'],
    guardian: 'le Gardien Plumeux, haut de quatre metres, qui n\'a jamais dormi',
    flavors: {
      force: 'Ouvrir un passage a la machette',
      arcane: 'Lire les glyphes et reveiller ce qui dort',
      agilite: 'Sauter, grimper, ne jamais toucher le sol',
      esprit: 'Respecter les rites et demander le passage'
    }
  },
  {
    id: 'cyber',
    name: 'La Cite Cyberpunk',
    subtitle: 'Neon et corporations',
    palette: { accent: '#e04fd6', background: '#0d0a14', panel: '#181128', text: '#eadcf5' },
    questNouns: ['du Contrat Brule', 'de la Tour Basse', 'des Faux Papiers', 'du Reseau Noir', 'de la Pluie Acide'],
    objectives: [
      'extraire un temoin du quarante-deuxieme etage',
      'effacer votre dossier des serveurs de la corpo',
      'livrer un implant avant que son porteur ne meure'
    ],
    entry: 'La pluie tombe en biais sur les neons. Votre contact a dix minutes de retard, ce qui n\'arrive jamais.',
    roomNames: ['Parking Niveau -3', 'Marche Gris', 'Hall de Securite', 'Salle des Serveurs', 'Clinique Clandestine', 'Toit-Heliport'],
    enemies: ['deux agents en costume synthetique', 'un videur augmente', 'une meute de chiens-drones', 'un netrunner rival'],
    loot: ['une puce de credits anonyme', 'un pass de securite clone', 'un inhalateur de combat', 'des dossiers compromettants'],
    guardian: 'Kessler, chef de la securite, dont le bras droit coute plus cher que votre vie',
    flavors: {
      force: 'Frapper le premier et ne pas s\'excuser',
      arcane: 'Percer les pare-feux en pleine rue',
      agilite: 'Passer par les angles morts des cameras',
      esprit: 'Bluffer avec assez d\'aplomb pour y croire'
    }
  },
  {
    id: 'epave',
    name: 'L\'Epave Hantee',
    subtitle: 'Piraterie spectrale',
    palette: { accent: '#8fb8d8', background: '#0a0f16', panel: '#121c28', text: '#dde8f2' },
    questNouns: ['du Pavillon Noir', 'des Noyes', 'de la Brume Basse', 'du Coffre Scelle', 'de la Derniere Maree'],
    objectives: [
      'remonter le coffre de la cale inondee',
      'rompre le pacte qui retient l\'equipage a bord',
      'retrouver le journal du capitaine Morrow'
    ],
    entry: 'La coque gemit sous la houle. L\'eau monte de deux doigts a chaque heure, et personne ne l\'ecope.',
    roomNames: ['Pont Superieur', 'Cale Inondee', 'Cambuse', 'Sainte-Barbe', 'Cabine du Capitaine', 'Gaillard d\'Arriere'],
    enemies: ['un matelot noye qui vous appelle par votre nom', 'deux mutins spectraux', 'une chose enroulee dans les cordages', 'le second, fidele jusqu\'apres la mort'],
    loot: ['une poignee de doublons', 'un sextant en argent', 'une bouteille de rhum brut', 'une carte au trace incomplet'],
    guardian: 'le Capitaine Morrow, pendu a sa propre vergue et toujours aux ordres',
    flavors: {
      force: 'Le sabre repond plus vite que la parole',
      arcane: 'Defaire le noeud maudit qui tient l\'equipage',
      agilite: 'Filer par les cordages et les ecoutilles',
      esprit: 'Tenir tete a un mort qui exige son du'
    }
  },
  {
    id: 'manoir',
    name: 'Le Manoir Victorien',
    subtitle: 'Horreur gothique',
    palette: { accent: '#c25a5a', background: '#14100f', panel: '#211917', text: '#f0e2dc' },
    questNouns: ['de la Chambre Close', 'des Portraits', 'du Testament', 'de l\'Heure Treize', 'des Domestiques'],
    objectives: [
      'elucider la mort de lord Ashcombe avant l\'aube',
      'retrouver l\'enfant disparu dans l\'aile ouest',
      'detruire le portrait qui vieillit a votre place'
    ],
    entry: 'Le majordome vous ouvre sans un mot. Toutes les horloges de la maison indiquent la meme heure fausse.',
    roomNames: ['Vestibule', 'Bibliotheque', 'Salle a Manger', 'Aile Ouest Condamnee', 'Serre', 'Grenier'],
    enemies: ['une gouvernante au sourire fixe', 'des invites qui ne clignent pas des yeux', 'le chien de la maison, mort en 1887', 'votre propre reflet'],
    loot: ['une lettre cachetee', 'une cle en os', 'un laudanum ancien', 'une broche de famille'],
    guardian: 'Lady Ashcombe, qui recoit ce soir et n\'accepte pas les refus',
    flavors: {
      force: 'Enfoncer la porte et tant pis pour les convenances',
      arcane: 'Lire ce que la maison tente de cacher',
      agilite: 'Marcher sans faire craquer une seule latte',
      esprit: 'Tenir la conversation sans ceder un pouce'
    }
  },
  {
    id: 'cendres',
    name: 'Le Desert de Cendres',
    subtitle: 'Post-apocalyptique',
    palette: { accent: '#d88b3f', background: '#151009', panel: '#221a10', text: '#f2e5d2' },
    questNouns: ['du Dernier Puits', 'des Convois', 'de la Ration Manquante', 'du Vent Gris', 'des Carcasses'],
    objectives: [
      'ramener de l\'eau potable avant la nuit',
      'reparer le relais radio du secteur nord',
      'recuperer le moteur de l\'epave du convoi 9'
    ],
    entry: 'Le vent charrie une cendre tiede qui colle au visage. Le compteur de l\'abri descend sous les douze heures.',
    roomNames: ['Station-Service', 'Convoi Renverse', 'Abri Souterrain', 'Dune de Ferraille', 'Chateau d\'Eau', 'Camp des Rodeurs'],
    enemies: ['deux rodeurs armes de tuyaux', 'une meute affamee', 'un survivant paranoiaque', 'le chef de bande et ses deux lieutenants'],
    loot: ['un bidon d\'eau filtree', 'des pieces detachees', 'une boite de conserve intacte', 'un chargeur plein'],
    guardian: 'Vasco, qui tient le dernier puits et fixe lui-meme le prix',
    flavors: {
      force: 'Tirer, cogner, prendre ce qu\'il faut',
      arcane: 'Bricoler l\'electronique avec trois fils',
      agilite: 'Contourner par les carcasses sans lever de poussiere',
      esprit: 'Tenir une negociation le ventre vide'
    }
  },
  {
    id: 'feerie',
    name: 'Le Sanctuaire Feerique',
    subtitle: 'Merveilleux inquietant',
    palette: { accent: '#5fd9a0', background: '#0a1410', panel: '#122019', text: '#dff2e6' },
    questNouns: ['du Pacte Tenu', 'des Noms Voles', 'de la Ronde', 'du Fruit Defendu', 'des Sept Portes'],
    objectives: [
      'recuperer le nom vole a votre soeur',
      'quitter le cercle avant la septieme danse',
      'rendre au Roi d\'Epines ce qui lui a ete promis'
    ],
    entry: 'L\'herbe est trop verte et le silence trop propre. Une porte s\'ouvre dans un tronc qui n\'en avait pas.',
    roomNames: ['Cercle de Champignons', 'Verger Perpetuel', 'Pont de Rosee', 'Cour des Echanges', 'Miroir d\'Eau', 'Trone d\'Epines'],
    enemies: ['un farfadet qui exige un gage', 'deux chiens blancs aux oreilles rouges', 'une dame qui connait votre prenom', 'le chevalier de mousse'],
    loot: ['une cle qui n\'ouvre rien encore', 'un fruit qu\'il ne faut pas manger', 'un ruban noue trois fois', 'une piece d\'or qui refroidit'],
    guardian: 'le Roi d\'Epines, toujours poli, jamais clement',
    flavors: {
      force: 'Le fer froid reste la seule reponse honnete',
      arcane: 'Defaire le charme avant qu\'il ne prenne',
      agilite: 'Sortir du cercle au bon temps de la musique',
      esprit: 'Repondre sans jamais dire oui ni merci'
    }
  }
];

// Returns the theme assigned to a given absolute day index.
export function getThemeForDay(dayIndex) {
  const normalized = ((dayIndex % THEMES.length) + THEMES.length) % THEMES.length;
  const theme = THEMES[normalized];
  return theme;
}
