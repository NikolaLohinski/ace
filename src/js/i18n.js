const translations = {
  english: {
    loading: 'Loading',
    continue: 'Continue',
    back: 'Back',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    quit: 'Quit',
    home: {
      'joinRoom': 'Join room',
      'createRoom': 'Create room',
      'french': 'Fr',
      'english': 'En'
    },
    room: {
      'admin': 'Admin',
      'playerId': 'Player ID',
      'roomId': 'Room ID',
      'name': 'Name',
      'ready': 'Ready',
      'waitingForPlayers': 'Waiting for players...'
    },
    join: {
      'chooseNickname': 'Please choose your nickname',
      'chooseRoomId': 'Enter the ID of the game'
    },
    create: {
      'chooseNickname': 'Please choose your nickname'
    },
    game: {
      'menu': 'Menu',
      'scores': 'Scores',
      'bet': 'Bet',
      'pass': 'Pass'
    },
    errors: {
      'noWebsocket': 'Websocket is not supported by this browser. How about Mozilla Firefox ?',
      'serverUnreachable': 'The server seems to be unreachable. Try again later.',
      'lostConnection': 'Oops, it seems we have lost connection.',
      'invalidRoom': 'Room {roomId} does not exist.',
      'invalidPlayer': 'Player {playerId} does not exist.',
      'playerAlreadyInRoom': 'Player {playerId} is already in room {roomId}.',
      'roomFull': 'The room {roomId} is full.',
      'adminLeft': 'The admin left the game.',
      'updateDownloading': 'An update is available. The app will restart in a few seconds.'
    }
  },
  french: {
    loading: 'Chargement',
    continue: 'Continuer',
    back: 'Retour',
    yes: 'Oui',
    no: 'Non',
    cancel: 'Annuler',
    quit: 'Quitter',
    home: {
      'joinRoom': 'Rejoindre une partie',
      'createRoom': 'Créer une partie',
      'french': 'Fr',
      'english': 'En'
    },
    room: {
      'admin': 'Hôte',
      'playerId': 'Joueur',
      'roomId': 'Partie',
      'name': 'Nom',
      'ready': 'Prêt',
      'waitingForPlayers': 'En attente de joueurs...'
    },
    join: {
      'chooseNickname': 'Choisissez votre surnom',
      'chooseRoomId': 'Veuillez entrer l\'identifiant de la partie'
    },
    create: {
      'chooseNickname': 'Choisissez votre surnom'
    },
    game: {
      'menu': 'Menu',
      'scores': 'Scores',
      'bet': 'Annoncer',
      'pass': 'Passer'
    },
    errors: {
      'noWebsocket': 'Les Websocket ne sont pas prises en charge par ce navigateur. Essayez Mozilla Firefox.',
      'serverUnreachable': 'Oops, le serveur semble injoignable. Réessayez plus tard.',
      'lostConnection': 'Oops, il semblerait que vous ayez des problèmes de connexion.',
      'invalidRoom': 'La partie {roomId} n\'existe pas.',
      'invalidPlayer': 'Le joueur {playerId} n\'existe pas.',
      'playerAlreadyInRoom': 'Le joueur {playerId} est déjà dans la partie {roomId}.',
      'roomFull': 'La partie {roomId} est pleine.',
      'adminLeft': 'L\'hôte a quitté la partie.',
      'updateDownloading': 'Une mise-à-jour est disponible. L\'app va bientôt redémarrer.'
    }
  }
};

module.exports = (vue, defaultLanguage) => {
  // Add languages
  vue.i18n.add('english', translations.english);
  vue.i18n.add('french', translations.french);
  // Set default
  vue.i18n.set(defaultLanguage);
  return ['english', 'french'];
};
