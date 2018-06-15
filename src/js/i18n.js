const translations = {
  // ENGLISH
  'en-EN': {
    'currentLanguage': 'English',
    'home': {
      'playOffline': 'Offline'
    },
    'settings': {
      'title': 'Settings',
      'changeLanguage': 'Language ACE',
      'pleaseChooseName': 'Public ACE name',
      'reset': 'Reset ACE',
      'confirmReset': 'Are you sure you want to reset ACE completely ?'
    },
    'scores': {
      'title': 'Scores',
      'us': 'Us',
      'them': 'Them'
    },
    'menu': {
      'title': 'Menu',
      'quit': 'Quit',
      'sortCards': 'Sort cards',
      'youWillLoseYourCurrentProgress': 'You will lose your current progress'
    },
    'utils': {
      'ok': 'Ok',
      'warning': 'Warning',
      'cancel': 'Cancel',
      'you': 'You',
      'continue': 'Continue'
    },
    'play': {
      'title': 'Play',
      'start': 'Start',
      'bet': 'Bet',
      'pass': 'Pass',
      'toPass': 'Pass',
      'CAP': 'All',
      'GEN': 'Alone',
      'players': 'Players',
      'dealer': 'Dealer',
      'playerType': 'Type',
      'pleaseChooseAName': 'Please choose a pseudo',
      'wonPhrase': 'You won, congratulations !',
      'lostPhrase': 'Too bad, you lost...',
      'scoresUsThem': 'Us : {us} - Them : {them}',
      'withBelote': 'With belote',
      'made': 'Auction {auction} was achieved',
      'failed': 'Auction {auction} was lost',
      'achieved': 'Achieved',
      'lost': 'Failed',
      'lostGamePhrase': 'You lost the game...',
      'wonGamePhrase': 'Victory !',
      'playerCoinched': '{player} coinched !',
      'playerSurCoinched': '{player} surcoinched !',
      'ai': {
        'name': 'Bot',
        '1': 'Basic'
      }
    },
    'about': {
      'title': 'About'
    }
  },
  // FRANÇAIS
  'fr-FR': {
    'currentLanguage': 'Français',
    'home': {
      'playOffline': 'Hors-ligne'
    },
    'settings': {
      'title': 'Options',
      'cancel': 'Annuler',
      'changeLanguage': 'Langue de ACE',
      'pleaseChooseName': 'Votre pseudo ACE',
      'reset': 'Réinitialiser ACE',
      'confirmReset': 'Êtes-vous sûr de vouloir réinitialiser ACE ?'
    },
    'scores': {
      'title': 'Scores',
      'us': 'Nous',
      'them': 'Eux'
    },
    'menu': {
      'title': 'Menu',
      'quit': 'Quitter',
      'sortCards': 'Trier les cartes',
      'youWillLoseYourCurrentProgress': 'Vous ne pourrez plus reprendre le cours de la partie'
    },
    'utils': {
      'ok': 'Ok',
      'warning': 'Attention',
      'cancel': 'Annuler',
      'you': 'Vous',
      'continue': 'Continuer'
    },
    'play': {
      'title': 'Jouer',
      'start': 'Démarrer',
      'bet': 'Annonce',
      'pass': 'Passe',
      'toPass': 'Passer',
      'CAP': 'Capot',
      'GEN': 'Générale',
      'players': 'Joueurs',
      'dealer': 'Dealer',
      'playerType': 'Type',
      'pleaseChooseAName': 'Veuillez renseigner un pseudo',
      'wonPhrase': 'Victoire, bravo !',
      'lostPhrase': 'Dommage...',
      'scoresUsThem': 'Nous : {us} - Eux : {them}',
      'withBelote': 'Avec belote',
      'made': 'Annonce {auction} faite',
      'failed': 'Annonce {auction} chutée',
      'achieved': 'Fait',
      'lost': 'Chuté',
      'lostGamePhrase': 'Partie perdue...',
      'wonGamePhrase': 'Victoire !',
      'playerCoinched': 'Coinché par {player} !',
      'playerSurCoinched': 'Surcoinché par {player} !',
      'ai': {
        'name': 'Bot',
        '1': 'Basique'
      }
    },
    'about': {
      'title': 'À propos'
    }
  }
};

export default (vue) => {
  const languageList = [];
  for (const language in translations) {
    if (!translations.hasOwnProperty(language)) continue;
    languageList.push(language);
    vue.i18n.add(language, translations[language]);
  }
  const userLanguage = navigator.language || navigator.userLanguage;
  if (languageList.indexOf(userLanguage) !== -1) {
    vue.i18n.set(userLanguage);
  } else {
    vue.i18n.set(languageList[0]);
  }
};
