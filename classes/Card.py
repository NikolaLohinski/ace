SIMPLE = 0
ASSET = 1
NO_ASSETS = 2
ALL_ASSETS = 3
ORDERS = [
    ['7', '8', '9', 'j', 'q', 'k', '10', 'a'],
    ['7', '8', 'q', 'k', '10', 'a', '9', 'j'],
    ['7', '8', '9', 'j', 'q', 'k', '10', 'a'],
    ['7', '8', 'q', 'k', '10', 'a', '9', 'j']
]
PRICES = [
    [0, 0, 0, 2, 3, 4, 10, 11],
    [0, 0, 3, 4, 10, 11, 14, 20],
    [0, 0, 0, 2, 3, 4, 10, 19],
    [0, 0, 2, 3, 6, 7, 8, 12]
]


class Card(object):
    """This class is for describing the cards of the game"""

    def __init__(self, value, family, style=SIMPLE):
        """Constructor.

        Args:
            value (str):  value of the card ('7', '8', '9', 'j', 'q', 'k', '10',
             'a')
            family (str): family of the card ('h', 's', 'd', 'c')
            style (int): tells which style of counting does the card belong to
        """
        self.value = value
        self.family = family
        self.style = style

    def get_price(self):
        """Get price of card.
        Returns:
            (int): price in points of the card
        """
        return PRICES[self.style][self.get_rank()]

    def get_rank(self):
        """Get rank from 0 to 7 of the card in its family
        Returns:
            (int): rank of the card
        """
        return ORDERS[self.style].index(self.value)

    def set_style(self, style):
        """Set new style to card
        Args:
            style (int): new style to set
        """
        if style not in [SIMPLE, ASSET, NO_ASSETS, ALL_ASSETS]:
            raise AttributeError(
                '{} is not a permitted style of card'.format(style)
            )
        self.style = style

    def is_better(self, card):
        """Compare this card to another one
        Args:
            card (Card): other card
        Returns:
            (int): -1 if this one is not better than card, 0 if the two
            are equivalent, 1 if this one is better than card
        """
        if self.style in [ALL_ASSETS, NO_ASSETS]:
            if card.family != self.family:
                return 0
            elif card.get_rank() > self.get_rank():
                return -1
            else:
                return 1
        else:
            if card.family == self.family:
                if card.get_rank() > self.get_rank():
                    return -1
                else:
                    return 1
            else:
                if card.style == ASSET:
                    return -1
                elif self.style == ASSET:
                    return 1
                else:
                    return 0

    def __lt__(self, other):
        """Redefine '<' operator
        Args:
            other (Card): other card to compare this one to
        Returns:
            (bool): True if other is better than self
        """
        return self.is_better(other) < 0

    def __gt__(self, other):
        """Redefine '>' operator
        Args:
            other (Card): other card to compare this one to
        Returns:
            (bool): True if self is better than other
        """
        return self.is_better(other) > 0
