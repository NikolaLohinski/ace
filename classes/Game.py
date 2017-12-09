from classes.Engine import Engine


class Game(object):
    """Class that defines the game"""

    def __init__(self):
        """Constructor"""
        self.players = []
        self.teams = []
        self.engine = None

    def add_player(self, player_id):
        """Adds a player to the game.

        Args:
            player_id (int): id of the player to add to the game
        """

        if player_id in self.players:
            raise Exception('Player {} is already in the game.'.format(player_id))
        else:
            if type(player_id) == int:
                self.players.append(player_id)
            else:
                raise TypeError('Player id {} is not an integer.'.format(player_id))

    def team_up(self, player1, player2):
        """Team up players in a game.

        Args:
            player1 (int): first player of the team
            player2 (int): second player of the team
        """

        if player1 not in self.players:
            raise Exception('Player {} is not in the game.'.format(player1))
        elif player2 not in self.players:
            raise Exception('Player {} is not in the game.'.format(player2))
        elif all(player1 not in t and player2 not in t for t in self.teams):
            self.teams.append([player1, player2])
        else:
            raise Exception('One of the players is already affected.')

    def init_game_engine(self):
        """Intialize the game engine. Possible only when we have 4 players and 2 teams."""

        if len(self.players) != 4 or len(self.teams) != 2:
            raise Exception('Game has not been set properly to start the engine.')
        else:
            # First we need to reorder players to have them properly organized for the game
            team1 = self.teams[0]
            team2 = self.teams[1]
            self.players = [team1[0], team2[0], team1[1], team2[1]]
            # Reorganize teams to only use indexes
            self.teams = [[0, 2], [1, 3]]
            # Then only we can start the engine
            self.engine = Engine(players=self.players, teams=self.teams)

# For command line usage and testing
if __name__ == '__main__':
    cmdline_game = Game()
    id1 = input('Add 1st player to the game : (player\'s id) ')
    cmdline_game.add_player(int(id1))
    id2 = input('Add 2nd player to the game : (player\'s id) ')
    cmdline_game.add_player(int(id2))
    id3 = input('Add 3rd player to the game : (player\'s id) ')
    cmdline_game.add_player(int(id3))
    id4 = input('Add 4th player to the game : (player\'s id) ')
    cmdline_game.add_player(int(id4))
    ids = [id1, id2, id3, id4]
    player1_team1 = input('Affect team 1 with a player: ({}) '.format(','.join(ids)))
    ids.pop(ids.index(player1_team1))
    player2_team1 = input('Affect team 1 with a player: ({}) '.format(','.join(ids)))
    ids.pop(ids.index(player2_team1))
    cmdline_game.team_up(player1=int(player1_team1), player2=int(player2_team1))
    cmdline_game.team_up(player1=int(ids[0]), player2=int(ids[1]))
    print('Teams are: {} and {}'.format(cmdline_game.teams[0], cmdline_game.teams[1]))
    cmdline_game.init_game_engine()
    ids = [str(x) for x in cmdline_game.players]
    print('Players will be sitting as follows : {}'.format(','.join(ids)))
    dealer = input('Choose dealer : ({}) '.format(','.join(ids)))
    dealer_index = cmdline_game.players.index(int(dealer))
    print('_________________________\n\nNow starting the game ...\n_________________________')
    game_state, playing, possible_bets = cmdline_game.engine.deal(dealer_index)
    while game_state['game-data']['type'] == 'bet':
        cards = game_state['actors']['cards'][playing]
        print('\nIt is player\'s {} turn.'.format(cmdline_game.players[playing]))
        print('Hand :')
        print(cards)
        print('He can bet: {}'.format(','.join(str(x) for x in possible_bets)))
        p, b = cmdline_game.engine.leading_bet()
        print('Leading bet is {} by player {}'.format(str(b), str(cmdline_game.players[p])))
        do_pass = input('Do you want to pass ? (y/n) ')
        if do_pass == 'n':
            bet = input('Please choose a bet : ({}) '.format(','.join(str(x) for x in possible_bets)))
            family = input('Please choose a family : (h,c,s,d) ')
            game_state, playing, possible_bets = \
                cmdline_game.engine.bet(playing=playing, bet='{},{}'.format(bet, family))
        else:
            game_state, playing, possible_bets = cmdline_game.engine.bet(playing=playing)

