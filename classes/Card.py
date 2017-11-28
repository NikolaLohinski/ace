class Card(object):
    """This class is for describing the cards of the game"""

    def __init__(self, value, asset=False):
        """Constructor

        Args:
            value (str):  value of the card ('a,h', '8,c', 'q,d' etc...)
            asset (bool): tell if the card is an asset or not.
        """
        list_value = value.split(sep=',')
        self.number = list_value[0]
        self.family = list_value[1]
        self.asset = asset
        self.cardinal, self.price = self.convert(number=self.number, asset=self.asset)

    def __eq__(self, other):
        """Redefine equality operator."""
        return self.number == other.number and self.family == other.family and self.asset == other.asset

    def __str__(self):
        name = '{},{}'.format(self.number, self.family)
        if self.asset:
            name += '_'
        return name

    def __repr__(self):
        return self.__str__()

    def convert(self, number, asset):
        """Convert string value into a rank from 0 (worst) to 7 (best) in the family and a price.

        Args:
            number (str): value (str): natural language value of the card ('a', '8', 'q' etc...)
            asset (bool): tell if the card is an asset or not.

        Returns:
            int: Index of value in family
            int: Price of the card
        """
        order = ['7', '8', '9', 'j', 'q', 'k', '10', 'a']
        prices = [0, 0, 0, 2, 3, 4, 10, 11]
        if asset:
            order = ['7', '8', 'q', 'k', '10', 'a', '9', 'j']
            prices = [0, 0, 3, 4, 10, 11, 14, 20]
        index = order.index(number)
        return index, prices[index]

    def set_asset_status(self, is_asset):
        """Modify asset status of the card.

        Args:
            is_asset (bool): rather the card is an asset or not
        """
        self.asset = is_asset
        self.cardinal, self.price = self.convert(number=self.value, asset=is_asset)

    def is_better_than(self, card):
        """Check if a given card is better than the self one.

        Args:
            card (Card): the card to compare to

        Returns:
            bool: true if the current card is better than the parameter one, and false otherwise
        """
        if self.family != card.family:
            # Cards are not from the same family. Therefore, self is better iff it is an asset.
            return self.asset
        else:
            # Both cards are from the same family.
            return self.cardinal > card.cardinal

