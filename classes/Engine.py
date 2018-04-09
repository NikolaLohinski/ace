import random
from Card import Card


class Engine(object):
    """Class that defines the game engine"""
    __PHASE_BETS__ = 0
    __PHASE_PLAY__ = 1
    __PHASE_END__ = -1
    __FAMILIES__ = ['h', 'd', 's', 'c']
    __VALUES__ = ['7', '8', '9', 'j', 'q', 'k', '10', 'a']
    __PRICE_2_POINTS__ = dict({
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
    __PRICE_2_SCORE__ = dict({
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

    def __init__(self, deck=list()):
        """Constructor.
        Args:
            deck (list(Card)): deck from which to deal the game
        """
        if len(deck) == 0:
            for family in self.__FAMILIES__:
                deck += [
                    Card(value=value, family=family)
                    for value in self.__VALUES__
                ]
            random.shuffle(deck)
        if len(deck) != 32:
            raise AttributeError('[Engine.deal]: Deck is incomplete')
        self.deck = deck

    def init_bets_phase(self, players, order, dealer):
        """Deal cards from deck to players in order and clear bets
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            dealer(int): id of the dealer
        """
        if len(self.deck) != 32:
            raise AttributeError('[Engine.deal]: Deck is incomplete')
        cut_index = random.randint(3, 29)
        self.deck = self.deck[cut_index:] + self.deck[:cut_index]
        style = random.choice([[2, 3, 3], [3, 2, 3], [3, 3, 2]])
        start = order.index(dealer) + 1
        while len(self.deck) > 0:
            for nb_cards in style:
                for i in range(4):
                    p = players[order[(start + i) % 4]]
                    cards = self.deck[:nb_cards]
                    del self.deck[:nb_cards]
                    p.add_cards(cards=cards)
                    p.coinche = False
                    if len(p.bets) > 0:
                        p.bets.clear()

    def bet(self, players, order, turn, bet=None):
        """Bet.
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            turn(int): ID of the player currently betting
            bet(dict): the bet
        Returns:
            (int): id of next player to play or None if end of game
            (int): phase of game
        """
        player = players.get(turn)
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

    def play(self, players, order, turn, card_dict):
        """Play a card
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            turn(int): ID of the player currently betting
            card_dict(dict): the card to play
        Returns:
            (int): id of next player to play or None if end of game
            (int): phase of game
        """
        player = players.get(turn)
        # If everyone played, clear played cards
        if all([p.played is not None for p in players.values()]):
            for p in players.values():
                p.played = None
        # Play the card (if possible)
        player.play_card(card_dict=card_dict)
        # Check if turn is finished.
        ply_index = order.index(player.id)
        phase = self.__PHASE_PLAY__
        pile_players = []
        for i in range(4):
            ply_id = order[ply_index - i]
            played = players.get(ply_id).played
            if played is not None:
                pile_players = [ply_id] + pile_players
        if len(pile_players) == 4:
            # If turn is finished then update winner's of turn gains
            turn = max(
                pile_players, key=lambda j: players.get(j).played
            )
            players.get(turn).gain(
                cards=[players.get(i).played for i in pile_players]
            )
            if all([len(p.hand) == 0 for p in players.values()]):
                phase = self.__PHASE_END__
        else:
            turn = order[(order.index(player.id) + 1) % 4]
        # Set forbidden cards
        self.set_forbidden_cards(
            players=players,
            order=order,
            turn=turn
        )
        # return id of who's about to play and phase of game.
        return turn, phase

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
                    score = self.__PRICE_2_SCORE__.get(bet.get('price'))
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
                    price for price, score in self.__PRICE_2_SCORE__.items()
                    if score <= self.__PRICE_2_SCORE__.get(leading_price)
                ]

    def init_play_phase(self, players, order, turn):
        """Determine final auction, set forbidden cards, remove all possible
        bets etc... All in all, set all players ready for game
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            turn(int): id of who is about to play
        Returns:
            (int): id of the one who won the auctions
        """
        # Get winning auction
        leading_id = self.find_leading_bet_player(players=players)
        leader = players.get(leading_id)
        family = leader.bets[-1].get('family')
        # Clear bets and set style for all cards
        for p in players.values():
            p.played = None
            p.gained_cards.clear()
            p.forbidden_cards.clear()
            p.forbidden_bets.clear()
            for card in p.hand:
                if family == 'TA':
                    card.set_style(style=card.__STYLE_ALL_ASSETS__)
                elif family == 'SA':
                    card.set_style(style=card.__STYLE_NO_ASSETS__)
                else:
                    if card.family == family:
                        card.set_style(style=card.__STYLE_ASSET__)
                    else:
                        card.set_style(style=card.__STYLE_SIMPLE__)

        # Set forbidden cards for each player
        self.set_forbidden_cards(
            players=players, order=order, turn=turn
        )
        return leading_id

    def set_forbidden_cards(self, players, order, turn):
        """Determine and set forbidden cards for all players
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
            turn(int): id of who is about to play
            family(str): family of cards played ('h', 'c', 's', 'd', 'TA', 'SA')
        """
        leading_bet_id = self.find_leading_bet_player(players=players)
        family = players.get(leading_bet_id).bets[-1].get('family')
        ply_index = order.index(turn)
        pile_players = []
        for i in range(4):
            ply_id = order[ply_index - i]
            played = players.get(ply_id).played
            if played is not None:
                pile_players = [ply_id] + pile_players
        for ply_id, p in players.items():
            hand = p.hand
            if len(pile_players) == 0 or len(pile_players) == 4:
                p.forbidden_cards = list()
            else:
                turn_starter_card = players.get(pile_players[0]).played
                turn_leader = players.get(max(
                    pile_players, key=lambda j: players.get(j).played
                ))
                same_family_cards = list(filter(
                    lambda c: c.family == turn_starter_card.family,
                    hand
                ))
                # All assets
                if family == 'TA':
                    # if player has no cards from same family, then whatever
                    if len(same_family_cards) == 0:
                        p.forbidden_cards = list()
                    else:
                        better_cards = list(filter(
                            lambda c: c > turn_leader.played,
                            same_family_cards
                        ))
                        # if player has better cards than the leading one, then
                        # he must play those
                        if len(better_cards) > 0:
                            p.forbidden_cards = list(filter(
                                lambda c: not c.in_(better_cards),
                                hand
                            ))
                        else:
                            # Otherwise he can play whatever card from same
                            # family
                            p.forbidden_cards = list(filter(
                                lambda c: not c.in_(same_family_cards),
                                hand
                            ))
                # No assets
                elif family == 'SA':
                    # if player has no cards from same family, then whatever
                    if len(same_family_cards) == 0:
                        p.forbidden_cards = list()
                    else:
                        p.forbidden_cards = list(filter(
                            lambda c: c.family != turn_leader.played.family,
                            hand
                        ))
                else:
                    # Simple game
                    partner_id = order[(order.index(ply_id) + 2) % 4]
                    assets = list(filter(
                        lambda c: c.family == family,
                        hand
                    ))
                    # If no assets and no cards from same family, then whatever
                    if len(same_family_cards) == 0 and len(assets) == 0:
                        p.forbidden_cards = list()
                    # If assets, and no cards from same family, then cut
                    elif len(same_family_cards) == 0 and len(assets) > 0:
                        # if partner is leading, then no need to cut
                        if turn_leader.id == partner_id:
                            p.forbidden_cards = list()
                        else:
                            better_cards = list(filter(
                                lambda c: c > turn_leader.played,
                                same_family_cards
                            ))
                            # if player has better cards than the leading one,
                            # then he must play those
                            if len(better_cards) > 0:
                                p.forbidden_cards = list(filter(
                                    lambda c: not c.in_(better_cards),
                                    hand
                                ))
                            else:
                                # Otherwise he must play asset
                                p.forbidden_cards = list(filter(
                                    lambda c: not c.in_(assets),
                                    hand
                                ))
                    else:
                        # If cards from same family
                        if turn_starter_card.family == family:
                            # if assets is the card family
                            better_cards = list(filter(
                                lambda c: c > turn_leader.played,
                                same_family_cards
                            ))
                            # if player has better cards than the leading one,
                            # then he must play those
                            if len(better_cards) > 0:
                                p.forbidden_cards = list(filter(
                                    lambda c: not c.in_(better_cards),
                                    hand
                                ))
                            else:
                                # Otherwise he must play asset
                                p.forbidden_cards = list(filter(
                                    lambda c: not c.in_(same_family_cards),
                                    hand
                                ))
                        else:
                            # Otherwise first card is from regular family
                            p.forbidden_cards = list(filter(
                                lambda c: c.family != turn_starter_card.family,
                                hand
                            ))

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
        leading_id = self.find_leading_bet_player(players=players)
        # If we already coinched
        if players.get(partner).coinche or player.coinche:
            return False
        # If other team coinched, then we can surcoinche
        elif players.get(after).coinche or players.get(before).coinche:
            return True
        # If no one made a bid
        elif leading_id is None:
            return False
        # Finally this means the others have the lead therefore we can only
        # coinche after the one that has the lead has played
        elif leading_id in (player.id, partner):
            return False
        else:
            after_leader = order[(order.index(leading_id) + 1) % 4]
            return turn == after_leader

    def end_play_phase(self, players, order):
        """Finish play phase by determining final scores, and who won. Takes
        into account the belote, the coinches, etc...
        Args:
            players(dict(int: Player)): dict of id, players
            order(list(int)): order of players
        """
        leading_id = self.find_leading_bet_player(players=players)
        lead_pos = order.index(leading_id)
        bet = players.get(leading_id).bets[-1]
        stakes = self.__PRICE_2_SCORE__[bet.get('price')]
        goal = self.__PRICE_2_POINTS__[bet.get('price')]
        attack = (leading_id, order[(lead_pos + 2) % 4])
        defense = (order[(lead_pos - 1) % 4], order[(lead_pos + 1) % 4])
        coinched = any([players.get(p).coinche for p in defense])
        winners = attack
        if coinched:
            stakes *= 2
        surcoinched = any([players.get(p).coinche for p in attack])
        if surcoinched:
            stakes *= 2
        # Check for belote
        if bet.get('family') not in ['TA', 'SA']:
            king_belote = Card(
                value='k', family=bet.get('family'), style=Card.__STYLE_ASSET__
            )
            queen_belote = Card(
                value='q', family=bet.get('family'), style=Card.__STYLE_ASSET__
            )
            if any([
                king_belote.in_(players.get(p).gained_cards)
                and queen_belote.in_(players.get(p).gained_cards)
                for p in attack
            ]):
                goal = max(80, goal - 20)
        if bet.get('price') == 'cap':
            if any([len(players.get(p).gained_cards) > 0 for p in defense]):
                winners = defense
        elif bet.get('price') == 'gen':
            if len(players.get(leading_id).gained_cards) != 32:
                winners = defense
        else:
            score_attack = sum(
                [c.get_price() for c in players.get(attack[0]).gained_cards]
            ) + sum(
                [c.get_price() for c in players.get(attack[1]).gained_cards]
            )
            if score_attack < goal:
                winners = defense
        for ply_id in order:
            players.get(ply_id).update_history(
                winner=ply_id in winners,
                stakes=stakes,
                coinched=coinched,
                surcoinched=surcoinched
            )
