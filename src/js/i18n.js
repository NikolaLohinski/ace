const translations = {
  english: {
    loading: 'Loading',
    ready: 'Ready',
    continue: 'Continue',
    back: 'Back',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    quit: 'Quit',
    start: 'Start',
    ok: 'Ok',
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
      'bet': 'Bid',
      'pass': 'pass',
      'toPass': 'Pass',
      'change': 'Change',
      'wouldLikeToBet': 'Would you like to place a bid ?',
      'pleaseChoosePrice': 'Please choose a price for your bid on',
      'cap': 'All',
      'gen': 'Alone',
      'confirmBet': 'Please confirm your bid:',
      'coinched': 'Coinched',
      'surcoinched': 'Over-coinched',
      'playerCoinched': 'has coinched last auction !',
      'playerCoinchedDoYouSurcoinche': 'has coinched last auction ! Do you want to over-coinche ?',
      'playerSurcoinched': 'has over-coinched last auction !'
    },
    errors: {
      'noWebsocket': 'Websocket is not supported by this browser. How about Mozilla Firefox ?',
      'serverUnreachable': 'The server seems to be unreachable. Try again later.',
      'lostConnection': 'Oops, it seems we have lost connection.',
      'invalidRoom': 'Room you want to join does not exist.',
      'invalidPlayer': 'Given player does not exist anymore.',
      'playerAlreadyInRoom': 'The given player is already in the room.',
      'playerNotInRoom': 'The given player is not in the room.',
      'adminAlreadyInRoom': 'There is already an admin in the room.',
      'roomFull': 'Room is full.',
      'badRequest': 'An error occurred. The server rejected your request.',
      'invalidRestart': 'Impossible to reload last game.',
      'startAdminOnly': 'The admin only can start the game.',
      'gameStartedAlready': 'The game already started.',
      'betsStartedAlready': 'The auctions already started.',
      'cardIsForbidden': 'Impossible to play this card.'
    },
    notifications: {
      'adminLeft': 'The admin left the game.',
      'updateDownloading': 'An update is available. The app will restart in a few seconds.'
    }
  },
  french: {
    loading: 'Chargement',
    ready: 'Prêt',
    continue: 'Continuer',
    back: 'Retour',
    yes: 'Oui',
    no: 'Non',
    cancel: 'Annuler',
    quit: 'Quitter',
    start: 'Démarrer',
    ok: 'Ok',
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
      'toPass': 'Passer',
      'pass': 'passe',
      'change': 'Changer',
      'wouldLikeToBet': 'Voulez-vous faire une annonce ?',
      'pleaseChoosePrice': 'Choissisez une valeur pour votre annonce à',
      'cap': 'Capot',
      'gen': 'Générale',
      'confirmBet': 'Veuillez confirmer votre annonce :',
      'coinched': 'Coinché',
      'surcoinched': 'Sur-coinché',
      'playerCoinched': 'a coinché la dernière annonce !',
      'playerCoinchedDoYouSurcoinche': 'a coinché la dernière annonce ! On sur-coinche ?',
      'playerSurcoinched': 'a sur-coinché la dernière annonce !'
    },
    errors: {
      'noWebsocket': 'Les Websocket ne sont pas prises en charge par ce navigateur. Essayez Mozilla Firefox.',
      'serverUnreachable': 'Oops, le serveur semble injoignable. Réessayez plus tard.',
      'lostConnection': 'Oops, il semblerait que vous ayez des problèmes de connexion.',
      'invalidRoom': 'La partie que vous tentez de rejoindre n\'existe pas.',
      'invalidPlayer': 'Votre identifiant joueur n\'existe plus.',
      'playerAlreadyInRoom': 'Vous êtes déjà dans la partie.',
      'playerNotInRoom': 'Le joueur n\'est pas dans la partie.',
      'adminAlreadyInRoom': 'Il y a déjà un hôte dans la partie.',
      'roomFull': 'La partie est pleine.',
      'adminLeft': 'L\'hôte a quitté la partie.',
      'updateDownloading': 'Une mise-à-jour est disponible. L\'app va bientôt redémarrer.',
      'badRequest': 'Une erreur est survenue. Le serveur n\'a pas compris votre requête.',
      'invalidRestart': 'Impossible de charger la dernière partie.',
      'startAdminOnly': 'Seul l\'hôte peut démarrer la partie.',
      'gameStartedAlready': 'La partie a déjà démarré.',
      'betsStartedAlready': 'Les enchères ont déjà démarré.',
      'cardIsForbidden': 'Impossible de jouer cette carte.'
    },
    notifications: {
      'adminLeft': 'L\'hôte a quitté la partie.',
      'updateDownloading': 'Une mise-à-jour est disponible. L\'app va bientôt redémarrer.'
    }
  }
};

export default (vue) => {
  // Add languages
  vue.i18n.add('english', translations.english);
  vue.i18n.add('french', translations.french);
  // Set default
  vue.i18n.set('english');
};
