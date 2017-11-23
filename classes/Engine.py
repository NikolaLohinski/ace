from random import shuffle
from .Card import Card


class Engine(object):
    """Class that defines the game engine"""

    def __init__(self, players, teams):
        """Constructor"""
        hearts = [Card(x, 'h') for x in range(7, 14)] + [Card(1, 'h')]
        diamonds = [Card(x, 'd') for x in range(7, 14)] + [Card(1, 'd')]
        spades = [Card(x, 's') for x in range(7, 14)] + [Card(1, 's')]
        clubs = [Card(x, 'c') for x in range(7, 14)] + [Card(1, 'c')]
        self.deck = hearts + diamonds + spades + clubs
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
                'leading-player': -1,  # Player that is leading the bet
                'leading-bet': (-1, None),  # Value of the leading bet
                'game-type': {
                    'type': 'bet',  # which phase of the game : 'bet' or 'game'
                    'bet': (-1, None),  # which bet value did won if type == 'game'
                },
                'dealer': -1
            },
            'past': {
                'score': [0, 0],  # Score of each team
                'bets': [[], [], [], []],  # Keep trace of the bets
                'turns': [[], [], [], [], [], [], [], []],  # Keep trace of the turns
            }
        }

    def bet(self, playing, bet=(-1, None)):
        """Updates game state given a choice taken by the player. If the player has passed, then (-1, None)
        should be passed as a default bet.

        Args:
            playing (int): Index of the player who is playing.
            bet (tuple<int, str>): Bet that has been played.
        Returns:
            object: the new game state
            int: the new player that needs to play
            list: the list of possible bets

        """
        # Append the bet to the list
        possible_bets = []
        new_playing = (playing + 1) % 4
        self.current_game_state['past']['bets'][playing].append(bet)
        # Did the player pass
        if bet == (-1, None):
            # Is the leading player the player about to play ?
            if playing + 1 % 4 == self.current_game_state['game-data']['leading-player']:
                # Then it means it is the end of bets
                self.current_game_state['game-data']['game-type'] = {
                    'type': 'game',
                    'bet': self.current_game_state['game-data']['leading-bet']
                }
                new_playing = self.current_game_state['game-data']['dealer']
            else:
                # Check if no one bet
                if all(x == [(-1, None)] for x in self.current_game_state['past']['bets']):
                    new_playing = -1
                else:
                    possible_bets = self.possible_bets()
        else:
            # Then the new bet is the leading bet
            self.current_game_state['game-data']['leading-player'] = playing
            self.current_game_state['game-data']['leading-bet'] = bet
            possible_bets = self.possible_bets()
            # Check if it was the maximal bet
            if len(possible_bets) == 0:
                # In which case, get ready for the game
                self.current_game_state['game-data']['game-type'] = {
                    'type': 'game',
                    'bet': self.current_game_state['game-data']['leading-bet']
                }
                new_playing = self.current_game_state['game-data']['dealer']

        return self.current_game_state, new_playing, possible_bets

    def possible_bets(self):
        """Determines the possible bets of the current state

        Returns:
            list: the list of possible bets

        """
        bets = [80, 90, 100, 110, 120, 130, 140, 150, 160, 162]
        current_bet = self.current_game_state['game-data']['leading-bet'][0]
        possible_bets = [x for x in bets if x > current_bet]
        return possible_bets

    def play(self, playing, card_index):
        """Updates the current state given a player and the card he is about to play.

        Args:
            playing (int): Index of the player who is playing.
            card_index (int): Index of the card to be played in the hand of the player.
        Returns:
            object: the new game state
            int: the new player that needs to play
            list: the list of possible cards indexes for each player

        """

