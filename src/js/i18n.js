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
      'pleaseChooseName': 'Public ACE name'
    },
    'scores': {
      'title': 'Scores'
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
      'you': 'You'
    },
    'play': {
      'title': 'Play',
      'start': 'Start',
      'bet': 'Bet',
      'pass': 'Pass',
      'toPass': 'Pass',
      'CAP': 'All',
      'GEN': 'Alone',
      'AA': 'Assets only',
      'NA': 'No Assets',
      'players': 'Players',
      'pleaseChooseAName': 'Please choose a pseudo',
      'ai': {
        'name': 'Bot',
        'basic': 'Basic',
        'skilled': 'Skilled'
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
      'set': 'Ok',
      'cancel': 'Annuler',
      'changeLanguage': 'Langue de ACE',
      'pleaseChooseName': 'Votre pseudo ACE'
    },
    'scores': {
      'title': 'Scores'
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
      'you': 'Vous'
    },
    'play': {
      'title': 'Jouer',
      'start': 'Démarrer',
      'bet': 'Annonce',
      'pass': 'Passe',
      'toPass': 'Passer',
      'CAP': 'Capot',
      'GEN': 'Générale',
      'AA': 'Tout Atout',
      'NA': 'Sans Atout',
      'players': 'Joueurs',
      'pleaseChooseAName': 'Veuillez renseigner un pseudo',
      'ai': {
        'name': 'Bot',
        'basic': 'Basique',
        'skilled': 'Expérimenté'
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
