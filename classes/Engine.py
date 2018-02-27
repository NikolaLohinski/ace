import random
from classes.Card import Card

FAMILIES = ['h', 'c', 's', 'd']
VALUES = ['7', '8', '9', 'j', 'q', 'k', '10', 'a']


class Engine(object):
    """Class that defines the game engine"""

    def __init__(self, deck=list()):
        """Constructor.
        Args:
            deck (list(Card)): deck from which to deal the game
        """
        if len(deck) == 0:
            for family in FAMILIES:
                deck += [
                    Card(value=value, family=family)
                    for value in VALUES
                ]
            random.shuffle(deck)
        if len(deck) != 32:
            raise AttributeError('[Engine.deal]: Deck is incomplete')
        cut_index = random.randint(3, 29)
        deck = deck[cut_index:] + deck[:cut_index]
        self.deck = deck

    def deal(self, players, order, dealer):
        """Deal cards from deck to players in order
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            dealer(int): id of the dealer
        """
        if len(self.deck) != 32:
            raise AttributeError('[Engine.deal]: Deck is incomplete')
        style = random.choice([[2, 3, 3], [3, 2, 3], [3, 3, 2]])
        start = order.index(dealer) + 1
        while len(self.deck) > 0:
            for nb_cards in style:
                for i in range(4):
                    p = players[order[(start + i) % 4]]
                    cards = self.deck[:nb_cards]
                    del self.deck[:nb_cards]
                    p.add_cards(cards=cards)
