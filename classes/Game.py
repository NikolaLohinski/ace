import random
from time import time as UNIX_TIME_NOW

from classes.Player import Player
from classes.Engine import Engine

GAME_STATE_ROOM = 0
GAME_STATE_BETS = 1
GAME_STATE_PLAY = 2
GAME_STATE_INTER = 3
GAME_STATE_END = 4


class Game(object):
    """Room class to define a play room"""
    def __init__(self, game_id):
        """Constructor
        Args:
            game_id (int): unique identifier of the room
        """
        self.id = game_id
        self.ts = int(UNIX_TIME_NOW())
        self.admin_id = None
        self.players = dict()
        self.state = GAME_STATE_ROOM
        self.dealer = None
        self.order = None
        self.scores = None
        self.turn = None
        self.engine = None

    def output_for_client(self, client_id):
        """Output to JSON friendly object the game to a given client
        Args:
            client_id (int): id of the client destination
        Returns:
            (object): JSON friendly and filtered object for a given client
        """
        output = {
            'id': self.id,
            'state': self.state,
            'players': []
        }
        if self.order is not None:
            nb_ply = len(self.players)
            me_index = self.order.index(client_id)
            for i in range(nb_ply):
                ply = self.players.get(self.order[(me_index + i) % nb_ply])
                output['players'].append(
                    ply.output(
                        private=True if ply.id == client_id else False,
                        admin=self.admin_id == ply.id,
                        dealer=self.dealer == ply.id,
                        turn=self.turn == ply.id
                    )
                )
            if self.scores is not None:
                output['scores'] = {
                    'us': self.scores[client_id],
                    'them': self.scores[
                        self.order[(self.order.index(client_id) + 1) % 4]
                    ]
                }
        else:
            nb_ply = len(self.players)
            players = [p for p in self.players.values()]
            me_index = players.index(self.players.get(client_id))
            for i in range(nb_ply):
                ply = players[(me_index + i) % nb_ply]
                output['players'].append(
                    ply.output(
                        private=True if ply.id == client_id else False,
                        admin=self.admin_id == ply.id,
                        dealer=self.dealer == ply.id,
                        turn=self.turn == ply.id
                    )
                )
        return output

    def new_player(self, client, name, is_admin=False):
        """Add player to game
        Args:
            client (Client): client reference of the player
            name (str): name of the new player
            is_admin (bool): if the client is an admin or not
        """
        if self.players.get(client.id) is not None:
            raise Exception('playerAlreadyInRoom')
        if self.admin_id is not None and is_admin:
            raise Exception('adminAlreadyInRoom')
        if is_admin:
            self.admin_id = client.id
        player = Player(client_id=client.id, name=name)
        self.players[client.id] = player
        client.game_id = self.id

    def rm_player(self, client):
        """Remove player from game
        Args:
            client (Client): client reference of the player
        """
        player = self.players.get(client.id)
        if player is None:
            raise Exception('playerNotInRoom')
        self.players.pop(client.id)
        if self.admin_id == client.id:
            self.admin_id = None

    def update_player(self, client, key, value):
        player = self.players.get(client.id)
        if player is None:
            raise Exception('playerNotInRoom')
        setattr(player, key, value)

    def is_empty(self):
        """Says if room is empty or not
        Returns:
            (bool): True if room is empty
        """
        return len(self.players) == 0

    def start(self, client):
        """Start the game
        Args:
            client (Client): client reference of the game starter
        """
        if client.id != self.admin_id:
            raise Exception('startAdminOnly')
        if self.state > GAME_STATE_ROOM:
            raise Exception('[start]: game already started.')
        self.state = GAME_STATE_BETS
        if self.dealer is None:
            self.dealer = random.choice([k for k in self.players.keys()])
        if self.order is None:
            ids = self.players.keys()
            self.order = random.sample(ids, len(ids))
        if self.scores is None:
            self.scores = dict({
                i: 0 for i in self.order
            })
        self.turn = self.order[(self.order.index(self.dealer) + 1) % 4]
        self.engine = Engine()
        self.engine.deal(
            players=self.players,
            order=self.order,
            dealer=self.dealer
        )
