class TestBets(object):

    def test_basic_simple_bet(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [[0, 2], [1, 3]]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [[None], [None], ['80,s'], []]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=3, bet='90,h')
        # Assert result
        assert (
            state['past']['bets'] == [[None], [None], ['80,s'], ['90,h']] and
            playing == 0 and
            possible_bets == [100, 110, 120, 130, 140, 150, 160, 162]
        )

    def test_simple_betting_win(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [[0, 2], [1, 3]]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [[None], [None], ['80,s'], [None]]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=1)
        # Assert result
        assert (
            state['game-data']['type'] == 'game' and
            state['past']['bets'] == [[None], [None, None], ['80,s'], [None]] and
            playing == 0 and
            possible_bets == []
        )

    def test_no_one_bets(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [[0, 2], [1, 3]]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['game-data']['dealer'] = 0
        engine.current_game_state['past']['bets'] = [[None], [None], [None], []]
        # Test betting engine
        state, playing, possible_bets = engine.bet(playing=3)
        # Assert result
        assert (
            state['game-data']['type'] == 'bet' and
            state['past']['bets'] == [[None], [None], [None], [None]] and
            playing == -1 and
            possible_bets == []
        )

