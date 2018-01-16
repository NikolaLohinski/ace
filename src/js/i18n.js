const translations = {
  english: {
    loading: 'Loading',
    home: {
      'join room': 'Join room',
      'create room': 'Create room',
      'french': 'Fr',
      'english': 'En'
    },
    room: {
      'you': 'You',
      'playerId': 'Player ID',
      'roomId': 'Room ID',
      'name': 'Name',
      'ready': 'Ready',
      'yes': 'Yes',
      'no': 'No',
      'cancel': 'Cancel',
      'back': 'Back',
      'waitingForPlayers': 'Waiting for players...'
    },
    join: {
      'chooseNickname': 'Please choose your nickname',
      'chooseRoomId': 'Enter the ID of the game',
      'continue': 'Continue',
      'back': 'Back'
    },
    create: {
      'chooseNickname': 'Please choose your nickname',
      'continue': 'Continue',
      'back': 'Back'
    },
    errors: {
      'noWebsocket': 'Websocket is not supported by this browser. How about Mozilla Firefox ?',
      'serverUnreachable': 'The server seems to be unreachable. Try again later.',
      'lostConnection': 'Oops, it seems we have lost connection.',
      'invalidRoom': 'Room {roomId} does not exist.',
      'invalidPlayer': 'Player {playerId} does not exist.',
      'playerAlreadyInRoom': 'Player {playerId} is already in room {roomId}.',
      'roomFull': 'The room {roomId} is full.'
    }
  },
  french: {
    loading: 'Chargement',
    home: {
      'join room': 'Rejoindre une partie',
      'create room': 'Créer une partie',
      'french': 'Fr',
      'english': 'En'
    },
    room: {
      'you': 'Vous',
      'playerId': 'Joueur',
      'roomId': 'Partie',
      'name': 'Nom',
      'ready': 'Prêt',
      'yes': 'Oui',
      'no': 'Non',
      'cancel': 'Annuler',
      'back': 'Retour',
      'waitingForPlayers': 'En attente de joueurs...'
    },
    join: {
      'chooseNickname': 'Choisissez votre surnom',
      'chooseRoomId': 'Veuillez entrer l\'identifiant de la partie',
      'continue': 'Continuer',
      'back': 'Retour'
    },
    create: {
      'chooseNickname': 'Choisissez votre surnom',
      'continue': 'Continuer',
      'back': 'Retour'
    },
    errors: {
      'noWebsocket': 'Les Websocket ne sont pas prises en charge par ce navigateur. Essayez Mozilla Firefox.',
      'serverUnreachable': 'Oops, le serveur semble injoignable. Réessayez plus tard.',
      'lostConnection': 'Oops, il semblerait que vous ayez des problèmes de connexion.',
      'invalidRoom': 'La partie {roomId} n\'existe pas.',
      'invalidPlayer': 'Le joueur {playerId} n\'existe pas.',
      'playerAlreadyInRoom': 'Le joueur {playerId} est déjà dans la partie {roomId}.',
      'roomFull': 'La partie {roomId} est pleine.'
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
