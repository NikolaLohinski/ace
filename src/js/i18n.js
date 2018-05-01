const translations = {
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
      'sortCards': 'Sort cards'
    },
    'utils': {
      'ok': 'Ok',
      'cancel': 'Cancel'
    },
    'play': {
      'bet': 'Bet',
      'pass': 'Pass',
      'toPass': 'Pass',
      'CAP': 'All',
      'GEN': 'Alone',
      'AA': 'Assets only',
      'NA': 'No Assets'
    },
    'about': {
      'title': 'About'
    }
  },
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
      'sortCards': 'Trier les cartes'
    },
    'utils': {
      'ok': 'Ok',
      'cancel': 'Annuler'
    },
    'play': {
      'bet': 'Annonce',
      'pass': 'Passe',
      'toPass': 'Passer',
      'CAP': 'Capot',
      'GEN': 'Générale',
      'AA': 'Tout Atout',
      'NA': 'Sans Atout'
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
