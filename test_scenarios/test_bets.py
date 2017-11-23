class TestBets(object):

    def test_simple_bet(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [(0, 2), (1, 3)]
        engine = Engine(players=players, teams=teams)
        # Fake a betting state
        deck = engine.shuffle()
        engine.current_game_state['actors']['cards'] = [
            deck[0:8],
            deck[8:16],
            deck[16:24],
            deck[24:32]
        ]
        engine.current_game_state['game-data']['leading-player'] = 2
        engine.current_game_state['game-data']['leading-bet'] = (80, 's')
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [
            [(-1, None)],
            [(-1, None)],
            [(80, 's')],
            []
        ]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=3, bet=(90, 'h'))
        # Assert result
        assert (
            state['game-data']['leading-player'] == 3 and
            state['game-data']['leading-bet'] == (90, 'h') and
            state['past']['bets'] == [
                [(-1, None)],
                [(-1, None)],
                [(80, 's')],
                [(90, 'h')]
            ] and playing == 0 and
            possible_bets == [100, 110, 120, 130, 140, 150, 160, 162]
        )

    def test_simple_betting_win(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [(0, 2), (1, 3)]
        engine = Engine(players=players, teams=teams)
        # Fake a betting state
        deck = engine.shuffle()
        engine.current_game_state['actors']['cards'] = [
            deck[0:8],
            deck[8:16],
            deck[16:24],
            deck[24:32]
        ]
        engine.current_game_state['game-data']['leading-player'] = 2
        engine.current_game_state['game-data']['leading-bet'] = (80, 's')
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [
            [(-1, None), (-1, None)],
            [(-1, None)],
            [(80, 's')],
            [(-1, None)]
        ]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=1, bet=(-1, None))
        # Assert result
        assert (
            state['game-data']['game-type']['type'] == 'game' and
            state['game-data']['game-type']['bet'] == (80, 's') and
            state['past']['bets'] == [
                [(-1, None), (-1, None)],
                [(-1, None), (-1, None)],
                [(80, 's')],
                [(-1, None)]
            ] and playing == 0 and
            possible_bets == []
        )

    def test_no_one_bets(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [(0, 2), (1, 3)]
        engine = Engine(players=players, teams=teams)
        # Fake a betting state
        deck = engine.shuffle()
        engine.current_game_state['actors']['cards'] = [
            deck[0:8],
            deck[8:16],
            deck[16:24],
            deck[24:32]
        ]
        engine.current_game_state['game-data']['leading-player'] = 2
        engine.current_game_state['game-data']['leading-bet'] = (80, 's')
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [
            [(-1, None)],
            [(-1, None)],
            [(-1, None)],
            []
        ]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=3, bet=(-1, None))
        # Assert result
        assert (
            state['game-data']['game-type']['type'] == 'bet' and
            state['game-data']['game-type']['bet'] == (-1, None) and
            state['past']['bets'] == [
                [(-1, None)],
                [(-1, None)],
                [(-1, None)],
                [(-1, None)]
            ] and playing == -1 and
            possible_bets == []
        )

    def test_maximal_bet(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [(0, 2), (1, 3)]
        engine = Engine(players=players, teams=teams)
        # Fake a betting state
        deck = engine.shuffle()
        engine.current_game_state['actors']['cards'] = [
            deck[0:8],
            deck[8:16],
            deck[16:24],
            deck[24:32]
        ]
        engine.current_game_state['game-data']['leading-player'] = 2
        engine.current_game_state['game-data']['leading-bet'] = (90, 'd')
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [
            [(-1, None)],
            [(-1, None)],
            [(90, 'd')],
            []
        ]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=3, bet=(162, 'c'))
        # Assert result
        assert (
            state['game-data']['game-type']['type'] == 'game' and
            state['game-data']['game-type']['bet'] == (162, 'c') and
            state['past']['bets'] == [
                [(-1, None)],
                [(-1, None)],
                [(90, 'd')],
                [(162, 'c')]
            ] and playing == 0 and
            possible_bets == []
        )


class TestPlay(object):

    def test_simple_turn(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [(0, 2), (1, 3)]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['actors']['cards'] = [
            [],
            [],
            [],
            []
        ]
        engine.current_game_state['past']['turns'] = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ]
        engine.current_game_state['past']['score'] = [0, 0]
        engine.current_game_state['game-data']['leading-player'] = 2
        engine.current_game_state['game-data']['leading-bet'] = (80, 's')
        engine.current_game_state['game-data']['game-type']['bet'] = (80, 's')
        engine.current_game_state['game-data']['game-type']['type'] = 'game'
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [
            [(-1, None), (-1, None)],
            [(-1, None), (-1, None)],
            [(80, 's'), (-1, None)],
            [(90, 'c')]
        ]

