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

    def generate_new_game_state(self, players, teams):
        return {
            'actors': {
                'players': players,  # List of players
                'cards': [[], [], [], []],  # List of cards in each of the players' hands
                'teams': teams  # List of teams
            },
            'game-data': {
                'leading-player': -1,  # Player that is leading the bet
                'leading-bet': 0,  # Value of the leading bet
                'game-type': {
                    'type': 'bet',  # which phase of the game : 'bet' or 'game'
                    'bet': 0,  # which bet value did won if type == 'game'
                    'family': None  # which bet family did won if type == 'game
                },
                'coinched': False  # If the bet was coinched
            },
            'past': {
                'score': [0, 0],  # Score of each team
                'bets': [[], [], [], []],  # Keep trace of the bets
                'turns': [[], [], [], [], [], [], [], []],  # Keep trace of the turns
                'player-coinched': -1,  # Keep trace of a coinche coming from a player
                'player-surcoinched': -1  # Keep trace of a surcoinche coming from a player
            }
        }

    def bet(self, playing, bet=-1, family=None, coinche=False):

        return self.current_game_state, playing

    def shuffle(self):
        shuffle(self.deck)
        return self.deck

