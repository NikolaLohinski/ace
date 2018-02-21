const translations = {
  english: {
    loading: 'Loading',
    continue: 'Continue',
    back: 'Back',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    quit: 'Quit',
    start: 'Start',
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
      'waitingForPlayers': 'Waiting for players...',
      'everyoneHereShallStart': 'Everyone seems to be ready. Shall we start ?'
    },
    join: {
      'chooseNickname': 'Please choose your nickname',
      'chooseRoomId': 'Enter the ID of the game',
      'join': 'Join'
    },
    create: {
      'chooseNickname': 'Please choose your nickname',
      'create': 'Create'
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
      'invalidRoom': 'Room {game_id} does not exist.',
      'invalidPlayer': 'Player {player_id} does not exist.',
      'playerAlreadyInRoom': 'Player {player_id} is already in room {game_id}.',
      'playerNotInRoom': 'Player {player_id} is not in room {game_id}.',
      'adminAlreadyInRoom': 'Player {admin_id} is already admin of room {game_id}.',
      'roomFull': 'The room {game_id} is full.',
      'adminLeft': 'The admin left the game.',
      'updateDownloading': 'An update is available. The app will restart in a few seconds.',
      'badRequest': 'An error occurred. The server rejected your request.',
      'invalidRestart': 'Impossible to reload last game.',
      'startAdminOnly': 'The admin only can start the game.'
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
    start: 'Démarrer',
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
      'waitingForPlayers': 'En attente de joueurs...',
      'everyoneHereShallStart': 'Tout le monde est prêt. On commence ?'
    },
    join: {
      'chooseNickname': 'Choisissez votre surnom',
      'chooseRoomId': 'Veuillez entrer l\'identifiant de la partie',
      'join': 'Rejoindre'
    },
    create: {
      'chooseNickname': 'Choisissez votre surnom',
      'create': 'Créer'
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
      'invalidRoom': 'La partie {game_id} n\'existe pas.',
      'invalidPlayer': 'Le joueur {player_id} n\'existe pas.',
      'playerAlreadyInRoom': 'Le joueur {player_id} est déjà dans la partie {game_id}.',
      'playerNotInRoom': 'Le joueur {player_id} n\'est pas dans la partie {game_id}.',
      'adminAlreadyInRoom': 'Le joueur {admin_id} est déjà hôte de la partie {game_id}.',
      'roomFull': 'La partie {game_id} est pleine.',
      'adminLeft': 'L\'hôte a quitté la partie.',
      'updateDownloading': 'Une mise-à-jour est disponible. L\'app va bientôt redémarrer.',
      'badRequest': 'Une erreur est survenue. Le serveur n\'a pas compris votre requête.',
      'invalidRestart': 'Impossible de charger la dernière partie.',
      'startAdminOnly': 'Seul l\'hôte peut démarrer la partie.'
    }
  }
};

module.exports = (vue, defaultLanguage) => {
  // Add languages
  vue.i18n.add('english', translations.english);
  vue.i18n.add('french', translations.french);
  // Set default
  vue.i18n.set(defaultLanguage);
};
