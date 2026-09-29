// Situation bank. Actions are bound to the situation, never to the theme, so
// that every proposal matches what the room actually describes.
// Tokens {enemy} {hazard} {container} {local} {door} {guardian} are replaced
// at generation time with the vocabulary of the day.

export const SITUATIONS = {
  combat: [
    {
      text: '{enemy} surgit du couloir et vous coupe toute retraite.',
      actions: {
        force: 'Charger sans attendre et frapper le premier',
        arcane: 'Lancer une decharge avant qu\'il ne soit a portee',
        agilite: 'Esquiver, contourner, frapper dans le dos',
        esprit: 'Soutenir son regard et l\'obliger a reculer'
      }
    },
    {
      text: '{enemy} vous attend, immobile. Il etait la bien avant vous.',
      actions: {
        force: 'Briser sa garde d\'un seul assaut',
        arcane: 'Chercher la faille qui le maintient debout',
        agilite: 'Le laisser frapper dans le vide puis riposter',
        esprit: 'Comprendre ce qu\'il protege avant de le toucher'
      }
    },
    {
      text: '{enemy} n\'est pas seul. Le bruit a porte plus loin que prevu.',
      actions: {
        force: 'Tenir le goulet et ne laisser passer personne',
        arcane: 'Effondrer le passage derriere vous',
        agilite: 'Filer par {door} avant qu\'ils ne se referment',
        esprit: 'Lancer un ordre assez net pour semer le doute'
      }
    },
    {
      text: '{enemy} vous reconnait et prononce votre nom. C\'est pire.',
      actions: {
        force: 'Ne pas repondre et abattre la question',
        arcane: 'Couper le lien qui lui a donne ce savoir',
        agilite: 'Reculer hors de sa portee sans quitter la sortie des yeux',
        esprit: 'Lui demander qui le renseigne, et ecouter la reponse'
      }
    }
  ],

  fouille: [
    {
      text: '{container} n\'a pas encore ete ouvert. Tout le reste, si.',
      actions: {
        force: 'Forcer le couvercle a la pointe d\'une lame',
        arcane: 'Sonder le contenu avant d\'y poser la main',
        agilite: 'Crocheter le mecanisme sans le declencher',
        esprit: 'Chercher la marque du proprietaire et deviner sa logique'
      }
    },
    {
      text: 'Des traces recentes mènent a {door}, puis s\'arretent net.',
      actions: {
        force: 'Arracher le panneau pour voir ce qu\'il y a derriere',
        arcane: 'Faire parler l\'empreinte laissee dans l\'air',
        agilite: 'Suivre la piste au sol jusqu\'a son vrai point d\'arrivee',
        esprit: 'Reconstituer ce qui s\'est joue ici, dans l\'ordre'
      }
    },
    {
      text: 'La salle a ete pillee, puis quelqu\'un est revenu y cacher une chose.',
      actions: {
        force: 'Deplacer tout ce qui est trop lourd pour avoir ete bouge',
        arcane: 'Reveler ce qui a ete dissimule par un procede',
        agilite: 'Tater les interstices que personne ne pense a regarder',
        esprit: 'Se demander ce qu\'on cacherait, soi, dans cette piece'
      }
    },
    {
      text: '{container} est scelle par un procede que vous ne connaissez pas.',
      actions: {
        force: 'Le fracasser et accepter de perdre une part du contenu',
        arcane: 'Defaire le scellement dans le bon ordre',
        agilite: 'Trouver l\'ouverture de service que tout scellement possede',
        esprit: 'Reconnaitre la facture du sceau et son mot de passage'
      }
    }
  ],

  piege: [
    {
      text: '{hazard} occupe toute la largeur du passage.',
      actions: {
        force: 'Passer en force et encaisser ce qu\'il faudra',
        arcane: 'Neutraliser le mecanisme a distance',
        agilite: 'Franchir au bon rythme, sans jamais s\'arreter',
        esprit: 'Repérer la marge de securite laissee par le constructeur'
      }
    },
    {
      text: 'Le sol s\'incline d\'un degre a chaque pas. Quelque chose se referme.',
      actions: {
        force: 'Bloquer la descente avec ce qui tombe sous la main',
        arcane: 'Figer le mecanisme le temps de traverser',
        agilite: 'Courir vers le haut avant que la pente ne devienne mur',
        esprit: 'Trouver le contrepoids et comprendre ce qui l\'active'
      }
    },
    {
      text: '{hazard} s\'est deja declenche. Sur quelqu\'un d\'autre, avant vous.',
      actions: {
        force: 'Degager les restes pour liberer le passage',
        arcane: 'Verifier que le dispositif n\'a pas ete rearme',
        agilite: 'Emprunter exactement le trajet que l\'autre a rate',
        esprit: 'Lire l\'erreur du precedent pour ne pas la repeter'
      }
    },
    {
      text: 'Un mecanisme cliquete quelque part, hors de vue, et accelere.',
      actions: {
        force: 'Defoncer la cloison pour atteindre la source',
        arcane: 'Etouffer le dispositif avant la fin du decompte',
        agilite: 'Sortir de la piece avant le terme, tant pis pour le butin',
        esprit: 'Compter les intervalles et deduire ce qui se prepare'
      }
    }
  ],

  rencontre: [
    {
      text: '{local} vous attend, assis, comme si votre venue etait prevue.',
      actions: {
        force: 'Le relever par le col et exiger des explications',
        arcane: 'Verifier d\'abord s\'il est bien ce qu\'il parait',
        agilite: 'Se placer de facon a garder la sortie derriere soi',
        esprit: 'S\'asseoir en face et le laisser parler le premier'
      }
    },
    {
      text: '{local} vous barre la route sans arme, ce qui est plus inquietant.',
      actions: {
        force: 'L\'ecarter du passage, poliment ou non',
        arcane: 'Chercher ce qui le rend si sur de lui',
        agilite: 'Le contourner par {door} pendant qu\'il parle',
        esprit: 'Negocier le droit de passage et en fixer le prix'
      }
    },
    {
      text: '{local} saigne et parle vite. Le temps manque, visiblement.',
      actions: {
        force: 'Le porter hors de danger avant toute question',
        arcane: 'Stopper l\'hemorragie par ce que vous savez faire',
        agilite: 'Aller chercher ce dont il a besoin, et vite',
        esprit: 'Obtenir l\'essentiel avant qu\'il ne puisse plus parler'
      }
    },
    {
      text: '{local} propose un marche. Vous n\'aviez rien demande.',
      actions: {
        force: 'Refuser net et montrer que l\'affaire est close',
        arcane: 'Chercher la clause cachee dans sa formulation',
        agilite: 'Accepter, prendre l\'avance, et disparaitre',
        esprit: 'Renegocier jusqu\'a ce que le marche vous avantage'
      }
    }
  ],

  gardien: [
    {
      text: 'Face a vous se tient {guardian}. Il n\'y a plus de couloir derriere.',
      actions: {
        force: 'Engager franchement et ne plus reculer d\'un pas',
        arcane: 'Frapper la source de son pouvoir plutot que lui',
        agilite: 'Tourner autour et ne jamais rester deux fois au meme endroit',
        esprit: 'Lui opposer ce qu\'il a perdu et voir s\'il flechit'
      }
    },
    {
      text: '{guardian} vous laisse approcher. Il tient a ce que vous compreniez.',
      actions: {
        force: 'Profiter de son discours pour reduire la distance',
        arcane: 'Preparer la rupture pendant qu\'il parle',
        agilite: 'Reperer l\'angle mort de sa garde et s\'y tenir',
        esprit: 'Ecouter jusqu\'au bout et retourner sa propre logique'
      }
    }
  ]
};

// Theme specific vocabulary injected into the situation tokens.
export const THEME_LEXICON = {
  crypte: {
    hazard: ['une dalle a bascule', 'un rideau de lames rouillees', 'un puits sans margelle'],
    container: ['un sarcophage descelle', 'un reliquaire de plomb', 'un coffre d\'offrandes'],
    local: ['un pelerin egare', 'un fossoyeur qui n\'a plus d\'age', 'une penitente encapuchonnee'],
    door: ['une grille rouillee', 'une porte de chene clouee', 'un eboulement praticable']
  },
  station: {
    hazard: ['une coursive depressurisee', 'un arc electrique intermittent', 'un sas a cycle bloque'],
    container: ['un casier d\'equipage verrouille', 'un conteneur medical scelle', 'un caisson cryogenique'],
    local: ['un technicien terre depuis trois cycles', 'une officiere en combinaison', 'un passager clandestin'],
    door: ['un sas manuel', 'une trappe de maintenance', 'un conduit de ventilation']
  },
  jungle: {
    hazard: ['une fosse a pieux recouverte', 'un nid de guepes-rasoirs', 'un gue infeste'],
    container: ['une jarre rituelle', 'un autel a offrandes', 'une malle d\'expedition abandonnee'],
    local: ['un guide local qui n\'ira pas plus loin', 'un survivant de l\'expedition', 'un chasseur silencieux'],
    door: ['un rideau de lianes', 'une arche envahie', 'un pont de cordes']
  },
  cyber: {
    hazard: ['une tourelle automatique en veille', 'un champ de detecteurs', 'un plancher sous tension'],
    container: ['un coffre biometrique', 'une valise blindee', 'un terminal chiffre'],
    local: ['un fixeur nerveux', 'une gamine du marche gris', 'un ancien collegue devenu genant'],
    door: ['un tourniquet de securite', 'une porte blindee', 'une cage d\'ascenseur']
  },
  epave: {
    hazard: ['un pont eventre', 'une cale qui se remplit', 'un greement qui cede'],
    container: ['un coffre cercle de fer', 'une caisse d\'armes', 'le sac du bosco'],
    local: ['un naufrage encore lucide', 'le mousse, cache depuis des jours', 'une passagere qui ne dit pas son nom'],
    door: ['une ecoutille gauchie', 'une cloison defoncee', 'un escalier a demi immerge']
  },
  manoir: {
    hazard: ['un parquet pourri sur trois metres', 'un lustre qui tient a un fil', 'un escalier condamne'],
    container: ['un secretaire ferme a cle', 'une malle de voyage', 'une vitrine de curiosites'],
    local: ['une servante qui n\'a rien vu', 'un invite trop calme', 'le notaire de la famille'],
    door: ['une double porte capitonnee', 'une porte de service', 'un passage derriere la bibliotheque']
  },
  cendres: {
    hazard: ['un sol mine par les affaissements', 'une fuite de gaz au ras du sol', 'un fil tendu en travers'],
    container: ['une caisse de ravitaillement', 'un coffre de vehicule', 'une reserve enterree'],
    local: ['un charognard qui negocie', 'une mere de famille armee', 'un mecano sans piece detachee'],
    door: ['un rideau de tole', 'une portiere arrachee', 'une bouche d\'aeration']
  },
  feerie: {
    hazard: ['un cercle qu\'il ne faut pas couper', 'une eau qui rend bavard', 'un pont qui se paie'],
    container: ['un coffret sans serrure', 'un panier toujours plein', 'une bourse qui refuse de s\'ouvrir'],
    local: ['un passeur qui exige un gage', 'un enfant qui n\'en est pas un', 'une dame en vert'],
    door: ['une arche de ronces', 'une porte dans un tronc', 'un rideau de pluie fine']
  }
};
