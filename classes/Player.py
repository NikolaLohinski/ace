PLAYER_STATE_PAUSE = 0
PLAYER_STATE_READY = 1
PLAYER_DISCONNECTED = -1


class Player(object):
    """Class to define a player"""
    def __init__(self, client_id, name):
        """Constructor
        Args:
            client_id (int): client identifier of the player
            name (str): name of the player
        """
        self.id = client_id
        self.name = name
        self.hand = list()
        self.bets = list()
        self.coinche = False
        self.state = PLAYER_STATE_PAUSE
        self.previous_state = PLAYER_STATE_PAUSE
        self.forbidden_bets = list()
        self.forbidden_cards = list()

    def output(
            self,
            private=False,
            admin=False,
            dealer=False,
            can_coinche=False,
            turn=False,
    ):
        """Output a JSON friendly object representing the player
        Args:
            private (bool): says rather the output should be private or public
            for other players to see.
            admin (bool): whether the player is admin of the game or not
            dealer (bool): whether the player is dealer of the game or not
            can_coinche (bool): whether the player can coinche or not
            turn (bool): whether it's this player's turn to play or not
        Returns:
            (object): JSON friendly and filtered object
        """
        output = {
            'name': self.name,
            'bets': self.bets,
            'admin': admin,
            'dealer': dealer,
            'coinche': self.coinche,
            'can_coinche': can_coinche,
            'state': self.state,
            'turn': turn,
            'forbidden_bets': self.forbidden_bets
        }
        if private:
            self.sort_hand()
            output['id'] = self.id
            output['hand'] = self.hand
            output['forbidden_cards'] = self.forbidden_cards
        return output

    def is_connected(self):
        """Tell if player is in connected state
        Returns:
            (bool): boolean telling whether player is connected or not
        """
        return self.state != PLAYER_DISCONNECTED

    def disconnect(self):
        """Change state of player to disconnect him
        """
        self.previous_state = self.state
        self.state = PLAYER_DISCONNECTED

    def reconnect(self):
        """Change state of player to disconnect him
        """
        if self.state == PLAYER_DISCONNECTED:
            self.state = self.previous_state

    def add_cards(self, cards):
        """Give cards to player
        Args:
            cards (list(Card)): list of cards
        """
        self.hand += cards

    def sort_hand(self):
        """Sort hand of the player by colors and rank.
        """
        hand = []
        for f in ['h', 'c', 'd', 's']:
            colour = list(filter(lambda c: c.family == f, self.hand))
            colour.sort()
            hand.extend(colour)
        self.hand = hand

