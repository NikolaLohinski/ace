from classes.Engine import Engine


class Game(object):
    """Class that defines the game"""

    def __init__(self, players, team1, dealer):
        """Constructor"

        Args:
            players (list<int>): list of player ids
            team1 (list<int>): list of the players of the first team
            dealer (int): index in the players' list of the dealer
        """
        self.players = []
        self.teams = []
        self.engine = None
        for p in players:
            self.add_player(player_id=p)
        self.team_up(player1=team1[0], player2=team1[1])
        self.init_game_engine(dealer=dealer)

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
            other_team = [x for x in self.players if x not in [player1, player2]]
            self.players = [player1, other_team[0], player2, other_team[1]]
            self.teams = [[0, 2], [1, 3]]
        else:
            raise Exception('One of the players is already affected.')

    def get_type(self):
        """Returns the type of the game, 'bets' or 'game' or None if no game has been started

        Returns:
            str/None: the type
        """
        game_type = None
        if self.engine is not None:
            game_type = self.engine.current_game_state['game-data']['type']
        return game_type

    def init_game_engine(self, dealer):
        """Intialize the game engine. Possible only when we have 4 players and 2 teams.

        Args:
            dealer (int): dealer of the game
        """

        if len(self.players) != 4 or len(self.teams) != 2 or dealer not in self.players:
            raise Exception('Game has not been set properly to start the engine.')
        else:
            self.engine = Engine(players=self.players, teams=self.teams, dealer=self.players.index(dealer))

    def start_bets(self, input_callback, end_callback):
        """Starts the bets phase and calls the callback whenever something is needed.

        Args:
            input_callback (fun): function to call when an input is needed
            end_callback (fun): function to call when the betting phase is done
        """
        state, player, possibles = self.engine.deal()
        while state['game-data']['type'] == 'bet':
            cards = state['actors']['cards'][player]
            leading_ply, leading_bet = self.engine.leading_bet()
            bet = input_callback(
                player=self.players[player],
                cards=cards,
                possibles=possibles,
                lead=(self.players[leading_ply], leading_bet)
            )
            state, player, possibles = self.engine.bet(playing=player, bet=bet)
            if player == -1:
                break
        end_callback(state=state, player=player)

    def start_play(self, input_callback, end_callback):
        """Starts the playing phase and calls the callback whenever something is needed.

        Args:
            input_callback (fun): function to call when an input is needed
            end_callback (fun): function to call when the playing phase is done
        """
        state, player, possibles = self.engine.init_play()
        leading_ply = -1
        leading_bet = None
        while self.get_type() is not None:
            turn_index = self.engine.get_current_turn_index()
            fold = self.engine.current_game_state['past']['turns'][turn_index]
            cards = state['actors']['cards'][player]
            leading_ply, leading_bet = self.engine.leading_bet()
            scores = self.engine.current_game_state['past']['score']
            if player in self.engine.current_game_state['actors']['teams'][1]:
                scores = scores[::-1]
            card = input_callback(
                fold=fold,
                player=self.players[player],
                cards=cards,
                possibles=possibles[player],
                lead=(self.players[leading_ply], leading_bet),
                scores=scores
            )
            state, player, possibles = self.engine.play(playing=player, card_index=card)

        end_callback(state=state, lead=(self.players[leading_ply], leading_bet))
