import random
from collections import defaultdict
from classes.Card import Card

FAMILIES = ['h', 'c', 's', 'd']
VALUES = ['7', '8', '9', 'j', 'q', 'k', '10', 'a']

PRICE_2_GOAL_POINTS = dict({
    '80': 82,
    '90': 90,
    '100': 100,
    '110': 110,
    '120': 120,
    '130': 130,
    '140': 140,
    '150': 150,
    '160': 160,
    '170': 170,
    '180': 180,
    'cap': 162,
    'gen': 162
})
PRICE_2_SCORE = dict({
    '80': 80,
    '90': 90,
    '100': 100,
    '110': 110,
    '120': 120,
    '130': 130,
    '140': 140,
    '150': 150,
    '160': 160,
    '170': 170,
    '180': 180,
    'cap': 250,
    'gen': 300
})

SIMPLE = 0
ASSET = 1
NO_ASSETS = 2
ALL_ASSETS = 3

FAMILY_BET_2_CARD_STYLE = dict({
    'h': defaultdict(lambda: SIMPLE, {
        'h': ASSET,
    }),
    'c': defaultdict(lambda: SIMPLE, {
        'c': ASSET,
    }),
    's': defaultdict(lambda: SIMPLE, {
        's': ASSET,
    }),
    'd': defaultdict(lambda: SIMPLE, {
        'd': ASSET,
    }),
    'TA': defaultdict(lambda: ALL_ASSETS),
    'SA': defaultdict(lambda: NO_ASSETS)
})


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
        self.__PHASE_BETS__ = 0
        self.__PHASE_PLAY__ = 1
        self.__PHASE_END__ = -1

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

    def bet(self, players, order, player, bet=None):
        """Bet.
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            player(Player): the player currently betting
            bet(dict): the bet
        Returns:
            (int): id of next player to play or None if end of game
            (int): phase of game
        """
        if bet is not None:
            if bet.get('price') in player.forbidden_bets:
                raise Exception('badRequest')
        player.bets.append(bet)
        self.set_forbidden_bets(players=players)
        # Did everyone pass
        if all((
                len(p.bets) > 0 and p.bets[-1] is None
                for p in players.values()
        )):
            return None, self.__PHASE_END__
        else:
            next_ply = order[(order.index(player.id) + 1) % len(order)]
            # Is the player who is about to play leading
            if next_ply == self.find_leading_bet_player(players=players):
                return None, self.__PHASE_PLAY__
            else:
                return next_ply, self.__PHASE_BETS__

    def find_leading_bet_player(self, players):
        """Determine leading bet player among the players
        Args:
            players(dict(int: Player)): dict of id, players
        Returns:
            (int): id of the leading player, or None if no leader
        """
        leading = None
        lead_score = 0
        for ply_id, ply in players.items():
            if len(ply.bets) > 0:
                bet = ply.bets[-1]
                if bet is not None:
                    score = PRICE_2_SCORE.get(bet.get('price'))
                    if score > lead_score:
                        leading = ply_id
                        lead_score = score
        return leading

    def set_forbidden_bets(self, players):
        """Determine and set forbidden bets for all players
        Args:
            players(dict(int: Player)): dict of id, players
        """
        leader_id = self.find_leading_bet_player(players=players)
        for ply_id, ply in players.items():
            if leader_id is None:
                ply.forbidden_bets = list()
            else:
                leading_price = players.get(leader_id).bets[-1].get('price')
                ply.forbidden_bets = [
                    price for price, score in PRICE_2_SCORE.items()
                    if score <= PRICE_2_SCORE.get(leading_price)
                ]

    def can_player_coinche(self, player, turn, order, players):
        """Determine if a given player can coinche or not
        Args:
            player (Player): player in question
            turn (int): identifier of player who's about to play
            order (list(int)): list of identifiers in order
            players (dict(int: Player)): dict of players
        """
        index_of_ply = order.index(player.id)
        before = order[(index_of_ply - 1) % 4]
        after = order[(index_of_ply + 1) % 4]
        partner = order[(index_of_ply + 2) % 4]
        # If we already coinched
        if players.get(partner).coinche or player.coinche:
            return False
        leading_id = self.find_leading_bet_player(players=players)
        if leading_id in [player.id, partner]:
            # If other team already coinched, then we can surcoinche
            if players.get(after).coinche or players.get(before).coinche:
                return True
            else:
                # Otherwise it means we have the lead
                return False
        if leading_id is None:
            return False
        # Finally this means the others have the lead therefore we can only
        # coinche after the one that has the lead has played
        return turn == order[(order.index(leading_id) + 1) % 4] or turn is None
