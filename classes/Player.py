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

    def output(self, private=False, admin=False, dealer=False, turn=False):
        """Output a JSON friendly object representing the player
        Args:
            private (bool): says rather the output should be private or public
            for other players to see.
            admin (bool): whether the player is admin of the game or not
            dealer (bool): whether the player is dealer of the game or not
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
            'state': self.state,
            'turn': turn
        }
        if private:
            output['id'] = self.id
            output['hand'] = self.hand
        return output

    def add_cards(self, cards):
        """Give cards to player
        Args:
            cards (list(Card)): list of cards
        """
        self.hand += cards
