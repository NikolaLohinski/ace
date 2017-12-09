from random import shuffle
from classes.Card import Card


class Engine(object):
    """Class that defines the game engine"""

    def __init__(self, players, teams):
        """Constructor.

        Args:
            players (list<int>): List of player IDs.
            teams (list<tuple<int>>): List of teams. A team is a combination of indices in the players list.
                For example teams = [(1, 2), (0, 3)].

        """
        self.deck = []
        for f in ['h', 'c', 's', 'd']:
            self.deck += [Card('{},{}'.format(v, f)) for v in ['7', '8', '9', 'j', 'q', 'k', '10', 'a']]
        self.current_game_state = self.generate_new_game_state(players, teams)

    def shuffle(self):
        """Shuffles the current deck

        Returns:
            object: the shuffled deck

        """
        shuffle(self.deck)
        return self.deck

    def generate_new_game_state(self, players, teams):
        """Return a default game state that has not been initialized.

        Args:
            players (list<int>): List of player IDs.
            teams (list<tuple<int>>): List of teams. A team is a combination of indices in the players list.
                For example teams = [(1, 2), (0, 3)].
        Returns:
            object: returns a factory setting game state

        """
        return {
            'actors': {
                'players': players,  # List of players
                'cards': [[], [], [], []],  # List of cards in each of the players' hands
                'teams': teams  # List of teams
            },
            'game-data': {
                'type': 'bet',
                'dealer': -1,
                'winner': -1
            },
            'past': {
                'score': [0, 0],  # Score of each team
                'bets': [[], [], [], []],  # Keep trace of the bets
                'turns': [],  # Keep trace of the turns
            }
        }

    def deal(self, dealer=0):
        """Deal the cards and determine first player to bet.

        Args:
            dealer (int): dealer of the game.
        Returns:
            object: the current game state
            int: the player about to play
            list: list of possible bets
        """
        self.deck = self.shuffle()
        self.current_game_state['actors']['cards'] = [[], [], [], []]
        # Dealing 3-2-3
        for i in range(4):
            p = (i + dealer) % 4
            self.current_game_state['actors']['cards'][p] += self.deck[(0 + 3 * p):(3 + 3 * p)]
            self.current_game_state['actors']['cards'][p] += self.deck[(12 + 2 * p):(14 + 2 * p)]
            self.current_game_state['actors']['cards'][p] += self.deck[(20 + 3 * p): (23 + 3 * p)]
        return self.current_game_state, (dealer + 1) % 4, self.possible_bets()

    def bet(self, playing, bet=None):
        """Updates game state given a choice taken by the player. If the player has passed, then (-1, None)
        should be passed as a default bet.

        Args:
            playing (int): Index of the player who is playing.
            bet (str): Bet that has been played.
        Returns:
            object: the new game state
            int: the new player that needs to play
            list: the list of possible bets

        """
        # Append the bet to the list
        possible_bets = []
        new_playing = (playing + 1) % 4
        leading_player, leading_bet = self.leading_bet()
        self.current_game_state['past']['bets'][playing].append(bet)
        # Did the player pass
        if bet is None:
            # Is the leading player the player about to play ?
            if playing + 1 % 4 == leading_player:
                # Then it means it is the end of bets
                self.current_game_state['game-data']['type'] = 'game'
                new_playing = self.current_game_state['game-data']['dealer']
            else:
                # Check if no one bet
                if all(x == [None] for x in self.current_game_state['past']['bets']):
                    new_playing = -1
                else:
                    possible_bets = self.possible_bets()
        else:
            possible_bets = self.possible_bets()

        return self.current_game_state, new_playing, possible_bets

    def leading_bet(self):
        leading_player = -1
        leading_bet = 0
        max_bet = ''
        for player in range(4):
            for bet_str in self.current_game_state['past']['bets'][player]:
                if bet_str is not None:
                    bet = int(bet_str.split(',')[0])
                    if bet > leading_bet:
                        leading_player = player
                        leading_bet = bet
                        max_bet = bet_str
        return leading_player, max_bet

    def possible_bets(self):
        """Determines the possible bets of the current state

        Returns:
            list: the list of possible bets

        """
        bets = [82, 90, 100, 110, 120, 130, 140, 150, 160, 162]
        leading_player, current_bet = self.leading_bet()
        if current_bet != '':
            bets = [x for x in bets if x > int(current_bet.split(',')[0])]
        return bets

    def play(self, playing, card_index):
        """Updates the current state given a player and the card he is about to play.

        Args:
            playing (int): Index of the player who is playing.
            card_index (int): Index of the card to be played in the hand of the player.
        Returns:
            object: the new game state
            int: the new player that needs to play, -1 if it's the end of the game
            list: the list of possible cards indexes for each player

        """

        new_playing = (playing + 1) % 4
        # First, get the card that is about to be played
        card = self.current_game_state['actors']['cards'][playing].pop(card_index)
        # Then play the card
        turn_index = self.get_current_turn_index()
        self.current_game_state['past']['turns'][turn_index].append(card)
        # Check if the turn is finished
        if len(self.current_game_state['past']['turns'][turn_index]) == 4:
            new_playing = self.determine_leader_of_turn(turn_index=turn_index)
            # Since the turn is finished, we may calculate the score and update the state
            self.current_game_state['past']['score'] = self.determine_score(turn_index=turn_index)
        possibles = self.determine_possibles(turn_index=turn_index)
        if turn_index == 7:
            new_playing = -1
            self.current_game_state['game-data']['winner'] = self.determine_winner()
        return self.current_game_state, new_playing, possibles

    def get_current_turn_index(self):
        """Get the index in the state of the current turn. If the index does not exist, create the turn.

        Returns:
            int: index in the list of turns in state > past of the current turn
        """
        turns = self.current_game_state['past']['turns']
        last_turn = len(turns) - 1
        if last_turn == -1:
            # Then it is the first turn
            self.current_game_state['past']['turns'].append([])
            return 0
        else:
            if len(turns[last_turn]) == 4:
                self.current_game_state['past']['turns'].append([])
                return last_turn + 1
            else:
                return last_turn

    def determine_leader_of_turn(self, turn_index):
        """Determine recursively who has the lead in the turn.

        Args:
            turn_index (int): Index in state of the turn

        Returns:
            int: Index of the player that is leading the turn
        """
        # If we just started the game, then the leader is the one just after the dealer
        if turn_index == -1:
            return (self.current_game_state['game-data']['dealer'] + 1) % 4
        else:
            # Else we need the leader from the previous turn to know who played what
            previous_leader = self.determine_leader_of_turn(turn_index=turn_index - 1)
            cards = self.current_game_state['past']['turns'][turn_index]
            leading_card = cards[0]
            cards = [x for i, x in enumerate(cards) if i > 0]
            player = previous_leader
            leading_player = previous_leader
            for c in cards:
                player = (player + 1) % 4
                if c.is_better_than(leading_card):
                    leading_card = c
                    leading_player = player
            return leading_player

    def determine_score(self, turn_index):
        """Determine recursively the score.

        Args:
            turn_index (int): Index in state of the turn

        Returns:
            list<int>: list of score for each team.
        """
        if turn_index == - 1:
            return [0, 0]
        else:
            winner_of_turn = self.determine_leader_of_turn(turn_index=turn_index)
            scores = self.determine_score(turn_index=turn_index - 1)
            teams = self.current_game_state['actors']['teams']
            index_of_team = [i for i, team in enumerate(teams) if winner_of_turn in team][0]
            for c in self.current_game_state['past']['turns'][turn_index]:
                scores[index_of_team] += c.price
            if turn_index == 7:
                scores[index_of_team] += 10
            return scores

    def determine_possibles(self, turn_index):
        """Determine cards that can be played by all players. If the player already played, then he cannot play
        anything.

        Args:
            turn_index (int): Index in state of the turn
            playing (int): Index of the player who's about to play

        Returns:
            list<list<int>>: For each player, each index of card he can play

        """
        possibles = [[i for i, x in enumerate(self.current_game_state['actors']['cards'][p])] for p in range(4)]
        turn = self.current_game_state['past']['turns'][turn_index]
        number_of_cards_on_pile = len(turn)
        if 4 > number_of_cards_on_pile > 0:
            possibles = [[], [], [], []]
            leader = self.determine_leader_of_turn(turn_index=turn_index)
            starter = self.determine_leader_of_turn(turn_index=turn_index - 1)
            first_card = turn[0]
            waiting_players = [(starter + i) % 4 for i in range(number_of_cards_on_pile, 4)]
            for p in waiting_players:
                cards = self.current_game_state['actors']['cards'][p]
                # check if first card wanted is asset
                if first_card.asset:
                    possibles[p] = self.determine_possible_assets(turn_index=turn_index, player=p)
                else:
                    # Otherwise, the first card is not an asset
                    same_family_cards = [x for x in cards if x.family == first_card.family]
                    if len(same_family_cards) > 0:
                        # Check if the player has any card of the family
                        possibles[p] = [cards.index(x) for x in same_family_cards]
                    else:
                        team = [t for t in self.current_game_state['actors']['teams'] if p in t][0]
                        if leader in team:
                            # If the leader is in the same team, then the player can play whatever he wants
                            possibles[p] = [i for i, x in enumerate(cards)]
                        else:
                            # Otherwise, if he has assets,
                            possibles[p] = self.determine_possible_assets(turn_index=turn_index, player=p)
        return possibles

    def determine_possible_assets(self, turn_index, player):
        turn = self.current_game_state['past']['turns'][turn_index]
        cards = self.current_game_state['actors']['cards'][player]
        assets = [c for c in cards if c.asset]
        if len(assets) > 0:
            # If we do, we need to check if we have better assets than all the assets currently played
            already_played_assets = [c for c in turn if c.asset]
            better_assets = []
            for a in assets:
                l = [al for al in already_played_assets if al.is_better_than(a)]
                if len(l) == 0:
                    better_assets.append(a)
            if len(better_assets) > 0:
                assets = better_assets
            return [cards.index(x) for x in assets]
        else:
            return [i for i, x in enumerate(cards)]

    def determine_winner(self):
        """Returns the index of the team that won the game

        Returns:
            int: index of the winners

        """
        leading_player, leading_bet = self.leading_bet()
        team = [i for i, t in enumerate(self.current_game_state['actors']['teams']) if leading_player in t][0]
        if self.current_game_state['past']['score'][team] >= int(leading_bet.split(',')[0]):
            return team
        return (team + 1) % 2

