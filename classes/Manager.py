from random import randint

from classes.Game import Game
from classes.Client import Client


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

    def create(self, socket, args):
        """Create new client and game and store in memory
        Args:
            socket (WSHandler): reference of client's socket
            args (object): arguments to create the game
        Returns:
            (list): output object response to notify of game creation
        """
        client_id = self.new_client(socket=socket)
        game_id = self.new_game()
        client = self.clients.get(client_id)
        self.games.get(game_id).new_player(
            client=client,
            name=args['player_name'],
            is_admin=True
        )
        B = {
            'game': self.games.get(game_id).output_for_client(client_id),
            'client': client.output()
        }
        output = [
            (
                client.socket,
                {
                    'H': 'GAME',
                    'B': B
                }
            )
        ]
        return output

    def join(self, socket, args):
        """Create new client and store in memory
        Args:
            socket (WSHandler): reference of client's socket
            args (object): arguments to create the game
        Returns:
            (list): output object response to notify of game joining
        """
        game_id = int(args['game_id'])
        game = self.games.get(game_id)
        if game is None:
            raise Exception('invalidRoom')
        client_id = self.new_client(socket=socket)
        client = self.clients.get(client_id)
        game.new_player(
            client=client,
            name=args['player_name'],
            is_admin=False
        )
        output = []
        for ply_id, player in game.players.items():
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

    def quit(self, args):
        """Quit game for client and delete its reference
        Args:
            args (object): arguments to delete the client
        Returns:
            (list): output object response to notify of client's leave
        """
        game_id = int(args['game_id'])
        game = self.games.get(game_id)
        client_id = int(args['id'])
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        game.rm_player(client=client)
        self.clients.pop(client_id)
        output = []
        players = game.players.copy().items()
        for ply_id, player in players:
            client = self.clients.get(ply_id)
            if game.admin_id is None:
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
        if game.is_empty():
            self.games.pop(game_id)
        return output

    def update(self, args):
        """Create update game given an action as input
        Args:
            args (object): arguments to update the game
        Returns:
            (list): output object response to notify of game update
        """
        game_id = int(args['game_id'])
        game = self.games.get(game_id)
        client_id = int(args['id'])
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        if args['target'] == 'PLAYER':
            game.update_player(client, args['key'], args['value'])
        else:
            raise Exception('badRequest')
        output = []
        for ply_id, player in game.players.items():
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

    def restart(self, socket, args):
        """Restart player
        Args:
            socket (WSHandler): reference of client's socket
            args (object): arguments to revive a disconnected player
        Returns:
            (list): output object response to notify of player revival
        """
        game_id = int(args['game_id'])
        game = self.games.get(game_id)
        client_id = int(args['id'])
        client = self.clients.get(client_id)
        if game is None or client is None:
            raise Exception('invalidRestart')
        client.socket = socket
        output = []
        B = {
            'game': game.output_for_client(client.id),
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

    def start(self, args):
        """Start game
        Args:
            args (object): arguments to start the game
        Returns:
            (list): output object response to notify of game start
        """
        game_id = int(args['game_id'])
        game = self.games.get(game_id)
        client_id = int(args['id'])
        client = self.clients.get(client_id)
        if game is None:
            raise Exception('invalidRoom')
        if client is None:
            raise Exception('invalidPlayer')
        game.start(client=client)
        output = []
        for ply_id, player in game.players.items():
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
