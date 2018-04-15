const translations = {
  'en-EN': {
    'currentLanguage': 'English',
    'home': {
      'playOffline': 'Offline'
    },
    'settings': {
      'title': 'Settings',
      'set': 'Set',
      'cancel': 'Cancel',
      'changeLanguage': 'Language ACE',
      'pleaseChooseName': 'Public ACE name'
    },
    'scores': {
      'title': 'Scores'
    },
    'menu': {
      'title': 'Menu'
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
      'title': 'Menu'
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
