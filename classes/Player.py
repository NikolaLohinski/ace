class Player(object):
    """Class to define a player"""
    __STATE_PAUSE__ = 0
    __STATE_READY__ = 1
    __DISCONNECTED__ = -1

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
        self.played = None
        self.gained_cards = list()
        self.state = self.__STATE_PAUSE__
        self.previous_state = self.__STATE_PAUSE__
        self.forbidden_bets = list()
        self.forbidden_cards = list()
        self.history = list()

    def output(
            self,
            private=False,
            admin=False,
            dealer=False,
            won_auctions=False,
            can_coinche=False,
            turn=False,
    ):
        """Output a JSON friendly object representing the player
        Args:
            private (bool): says rather the output should be private or public
            for other players to see.
            admin (bool): whether the player is admin of the game or not
            dealer (bool): whether the player is dealer of the game or not
            won_auctions (bool): whether the player won the auctions or not
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
            'won_auctions': won_auctions,
            'state': self.state,
            'turn': turn,
            'forbidden_bets': self.forbidden_bets,
            'played': self.played,
            'history': self.history
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
        return self.state != self.__DISCONNECTED__

    def disconnect(self):
        """Change state of player to disconnect him
        """
        self.previous_state = self.state
        self.state = self.__DISCONNECTED__

    def reconnect(self):
        """Change state of player to disconnect him
        """
        if self.state == self.__DISCONNECTED__:
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

    def play_card(self, card_dict):
        """Play card from hand given information on the card
        Args:
            card_dict (dict): info on the card
        Returns:
            (Card): reference to card
        """
        family = card_dict.get('family')
        value = card_dict.get('value')
        card = next(filter(
            lambda c: c.family == family and c.value == value,
            self.hand
        ), None)
        if card is None:
            raise Exception('badRequest')
        if card.in_(self.forbidden_cards):
            raise Exception('cardIsForbidden')
        self.played = card
        self.hand = list(filter(lambda c: not c.in_([card]), self.hand))

    def gain(self, cards):
        """Add cards to gained hands
        Args:
            cards(list(Card)): list of cards won in the turn
        """
        self.gained_cards.extend(cards)

    def update_history(self, winner, stakes, coinched=False, surcoinched=False):
        """Update history of player's previous games
        Args:
            winner(Boolean): say if the player won the game or not
            stakes(int): stakes at place
            coinched(Boolean): if someone coinched
            surcoinched(Boolean): if someone surcoinched
        """
        self.history.append({
            'winner': winner,
            'stakes': stakes,
            'coinched': coinched,
            'surcoinched': surcoinched
        })
