import random
from time import time as UNIX_TIME_NOW

from Player import Player
from Engine import Engine


class Game(object):
    """Room class to define a play room"""
    __STATE_ROOM__ = 0
    __STATE_BETS__ = 1
    __STATE_PLAY__ = 2
    __STATE_INTER__ = 3
    __STATE_END__ = 4

    def __init__(self, game_id):
        """Constructor
        Args:
            game_id (int): unique identifier of the room
        """
        self.id = game_id
        self.ts = int(UNIX_TIME_NOW())
        self.admin_id = None
        self.players = dict()
        self.state = self.__STATE_ROOM__
        self.dealer = None
        self.order = None
        self.goal = None
        self.turn = None
        self.engine = None
        self.won_auctions = None

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
        nb_ply = len(self.players)
        order = self.order
        if order is None:
            order = list(self.players.keys())
        me_index = order.index(client_id)
        for i in range(nb_ply):
            ply = self.players.get(order[(me_index + i) % nb_ply])
            output['players'].append(
                ply.output(
                    private=True if ply.id == client_id else False,
                    admin=self.admin_id == ply.id,
                    dealer=self.dealer == ply.id,
                    turn=self.turn == ply.id,
                    won_auctions=self.won_auctions == ply.id,
                    can_coinche=self.engine.can_player_coinche(
                        player=ply,
                        turn=self.turn,
                        order=order,
                        players=self.players
                    ) if self.state == self.__STATE_BETS__ else False
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
        """Update player
        Args:
            client (Client): client reference of the player to update
        """
        player = self.players.get(client.id)
        if player is None:
            raise Exception('playerNotInRoom')
        setattr(player, key, value)

    def reconnect_player(self, client):
        """Reconnect player
        Args:
            client (Client): client reference of the player to update
        """
        player = self.players.get(client.id)
        if player is None:
            raise Exception('playerNotInRoom')
        player.reconnect()

    def disconnect_player(self, client):
        """Disconnect player
        Args:
            client (Client): client reference of the player to update
        """
        player = self.players.get(client.id)
        if player is None:
            raise Exception('playerNotInRoom')
        player.disconnect()

    def is_empty(self):
        """Says if room is empty or not
        Returns:
            (bool): True if room is empty
        """
        return len(self.players) == 0

    def start(self, client):
        """Start to bet or the play. Trigger possible only by admin
        Args:
            client (Client): client reference of the admin
        """
        if client.id != self.admin_id:
            raise Exception('startAdminOnly')
        if self.state in (self.__STATE_ROOM__, self.__STATE_INTER__):
            self.start_bets()
        elif self.state == self.__STATE_BETS__:
            self.start_play()

    def start_bets(self):
        """Start bets phase
        """
        if self.state == self.__STATE_BETS__:
            raise Exception('betsStartedAlready')
        self.state = self.__STATE_BETS__
        if self.dealer is None:
            self.dealer = random.choice([k for k in self.players.keys()])
        if self.order is None:
            ids = self.players.keys()
            self.order = random.sample(ids, len(ids))
        if self.goal is None:
            self.goal = 1000
        self.turn = self.order[(self.order.index(self.dealer) + 1) % 4]
        self.engine = Engine()
        self.engine.init_bets_phase(
            players=self.players,
            order=self.order,
            dealer=self.dealer
        )

    def start_play(self):
        """Start play phase
        """
        if self.state == self.__STATE_PLAY__:
            raise Exception('gameStartedAlready')
        self.state = self.__STATE_PLAY__
        self.turn = self.order[(self.order.index(self.dealer) + 1) % 4]
        self.won_auctions = self.engine.init_play_phase(
            players=self.players,
            order=self.order,
            turn=self.turn
        )

    def coinche(self, client):
        """Client coinched !
        Args:
            client (Client): client reference of the player
        """
        if client.id not in self.order:
            raise Exception('playerNotInRoom')
        if self.state != self.__STATE_BETS__:
            raise Exception('badRequest')
        player = self.players.get(client.id)
        player.coinche = True
        self.turn = None

    def bet(self, client, bet=None):
        """Client bets something
        Args:
            client (Client): client reference of the player
            bet (dict): family (h, d, s, c, TA, SA) and price (80, 90 , ...,
            180, cap, gen) or none if nothing given
        """
        if client.id not in self.order:
            raise Exception('playerNotInRoom')
        if self.state != self.__STATE_BETS__:
            raise Exception('badRequest')
        if client.id != self.turn:
            raise Exception('badRequest')
        self.turn, phase = self.engine.bet(
            players=self.players,
            order=self.order,
            turn=self.turn,
            bet=bet
        )
        if self.turn is None and phase == self.engine.__PHASE_END__:
            self.state = self.__STATE_INTER__

    def play(self, client, card_dict):
        """Play a card
        Args:
            client (Client): client reference of the player
            card_dict (dict): card to play in client's hand
        """
        if client.id not in self.order:
            raise Exception('playerNotInRoom')
        if self.state != self.__STATE_PLAY__:
            raise Exception('badRequest')
        if client.id != self.turn:
            raise Exception('badRequest')
        self.turn, phase = self.engine.play(
            players=self.players,
            order=self.order,
            turn=self.turn,
            card_dict=card_dict
        )
        if phase == self.engine.__PHASE_END__:
            self.engine.end_play_phase(
                players=self.players,
                order=self.order
            )
            if self.is_game_finished():
                self.state = self.__STATE_END__
            else:
                self.state = self.__STATE_INTER__

    def is_game_finished(self):
        """Determine if game is finished or not.
        Returns:
            (Boolean): True if game is finished
        """
        p0 = self.players.get(self.order[0])
        total_p0 = sum([g.get('stakes') for g in p0.history])
        p1 = self.players.get(self.order[1])
        total_p1 = sum([g.get('stakes') for g in p1.history])
        if total_p0 >= self.goal or total_p1 >= self.goal:
            return True
        return False
