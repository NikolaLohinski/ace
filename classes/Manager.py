from random import randint

from Game import Game
from Client import Client


class Manager(object):
    """Manager class to handle players, games, sockets etc..."""

    def __init__(self):
        """Constructor

        Attributes:
            games (dict): id to game dictionary to store active games
            clients (dict): id to handler instance to store active clients

        """
        self.games = dict()
        self.clients = dict()

    def new_client_id (self):
        """Create new client id
        Returns:
            (int): new unused client ID
        """
        client_id = randint(0, 99999999)
        if self.clients.get(client_id) is None:
            return client_id
        else:
            return self.new_client_id()

    def new_game_id(self):
        """Create new game id
        Returns:
            (int): new unused game ID
        """
        game_id = randint(0, 999999)
        if self.games.get(game_id) is None:
            return game_id
        else:
            return self.new_game_id()

    def new_client(self, socket):
        """Create new client and store in memory
        Args:
            socket (WSHandler): reference of client's socket
        Returns:
            (int): newly created client identifier
        """
        new_id = self.new_client_id()
        new_client = Client(socket=socket, client_id=new_id)
        self.clients[new_id] = new_client
        return new_id

    def new_game(self):
        """Create a new game and store in memory
        Returns:
            (int): newly created game identifier
        """
        new_id = self.new_game_id()
        new_game = Game(game_id=new_id)
        self.games[new_id] = new_game
        return new_id

    def disconnect_client(self, socket):
        """Disconnect client when socket is closed from clients' side
        Args:
            socket (WSHandler): reference of client's socket
        Returns:
            (list): output object response to notify other players
        """
        output = []
        for client_id, client in self.clients.items():
            if client.socket == socket:
                game_id = client.game_id
                game = self.games.get(game_id)
                if game is not None:
                    game.disconnect_player(client)
                    output = self.output_game_to_all(game_id=game_id)
                break
        return output

    def create(self, socket, args):
        """Create new client and game and store in memory
        Args:
            socket (WSHandler): reference of client's socket
            args (dict): arguments to create the game
        Returns:
            (list): output object response to notify of game creation
        """
        client_id = self.new_client(socket=socket)
        game_id = self.new_game()
        client = self.clients.get(client_id)
        self.games.get(game_id).new_player(
            client=client,
            name=args.get('player_name'),
            is_admin=True
        )
        return self.output_game_to_all(game_id=game_id)

    def join(self, socket, args):
        """Create new client and store in memory
        Args:
            socket (WSHandler): reference of client's socket
            args (dict): arguments to create the game
        Returns:
            (list): output object response to notify of game joining
        """
        game_id = int(args.get('game_id'))
        game = self.games.get(game_id)
        if game is None:
            raise Exception('invalidRoom')
        client_id = self.new_client(socket=socket)
        client = self.clients.get(client_id)
        game.new_player(
            client=client,
            name=args.get('player_name'),
            is_admin=False
        )
        return self.output_game_to_all(game_id=game_id)

    def quit(self, args):
        """Quit game for client and delete its reference
        Args:
            args (dict): arguments to delete the client
        Returns:
            (list): output object response to notify of client's leave
        """
        game_id = int(args.get('game_id'))
        game = self.games.get(game_id)
        client_id = int(args.get('id'))
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        game.rm_player(client=client)
        self.clients.pop(client_id)
        output = []
        if game.admin_id is None:
            for ply_id, player in game.players:
                if player.is_connected():
                    client = self.clients.get(ply_id)
                    output.append(
                        (
                            client.socket,
                            {
                                'H': 'RESET'
                            }
                        )
                    )
                    game.rm_player(client=client)
                    self.clients.pop(client.id)
        else:
            output = self.output_game_to_all(game_id=game_id)
        if game.is_empty():
            self.games.pop(game_id)
        return output

    def update(self, args):
        """Create update game given an action as input
        Args:
            args (dict): arguments to update the game
        Returns:
            (list): output object response to notify of game update
        """
        game_id = int(args.get('game_id'))
        game = self.games.get(game_id)
        client_id = int(args.get('id'))
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        if args.get('target') == 'PLAYER':
            game.update_player(client, args.get('key'), args.get('value'))
        else:
            raise Exception('badRequest')
        return self.output_game_to_all(game_id=game_id)

    def restart(self, socket, args):
        """Restart player
        Args:
            socket (WSHandler): reference of client's socket
            args (dict): arguments to revive a disconnected player
        Returns:
            (list): output object response to notify of player revival
        """
        game_id = int(args.get('game_id'))
        game = self.games.get(game_id)
        client_id = int(args.get('id'))
        client = self.clients.get(client_id)
        if game is None or client is None:
            raise Exception('invalidRestart')
        client.socket = socket
        game.reconnect_player(client=client)
        return self.output_game_to_all(game_id=game_id)

    def start(self, args):
        """Start game
        Args:
            args (dict): arguments to start the game
        Returns:
            (list): output object response to notify of game start
        """
        game_id = int(args.get('game_id'))
        game = self.games.get(game_id)
        client_id = int(args.get('id'))
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        game.start(client=client)
        return self.output_game_to_all(game_id=game_id)

    def play(self, args):
        """Play something in the game. Can be a bet, a card, a coinche etc...
         Args:
            args (dict): arguments to start the game
        Returns:
            (list): output object response to notify of game start
        """
        game_id = int(args.get('game_id'))
        game = self.games.get(game_id)
        client_id = int(args.get('id'))
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        target = args.get('target')
        if target == 'BET':
            game.bet(client=client, bet=args.get('bet'))
        elif target == 'COINCHE':
            game.coinche(client=client)
        elif target == 'CARD':
            game.play(client=client, card_dict=args.get('card'))
        else:
            raise Exception('badRequest')
        return self.output_game_to_all(game_id=game_id)

    def output_game_to_all(self, game_id):
        """Output game to all players in game
        Args:
            game_id (int): identifier of the game
        Returns:
            (list): output object response for each player
        """
        game = self.games.get(game_id)
        output = []
        for ply_id, player in game.players.items():
            if player.is_connected():
                client = self.clients.get(ply_id)
                B = {
                    'game': game.output_for_client(ply_id),
                    'client': client.output()
                }
                output.append(
                    (
                        client.socket,
                        {
                            'H': 'GAME',
                            'B': B
                        }
                    )
                )
        return output
