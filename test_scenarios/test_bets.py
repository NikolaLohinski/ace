class TestBets(object):

    def test_simple_bet(self):
        from classes.Engine import Engine
        players = [12, 34, 56, 78]
        teams = [[players[0], players[2]], [players[1], players[3]]]
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
        engine.current_game_state['game-data']['leading-bet'] = 80
        engine.current_game_state['past']['bets'] = [
            [{'bet': -1, 'family': None}],
            [{'bet': -1, 'family': None}],
            [{'bet': 80, 'family': 's'}],
            []
        ]
        # Test betting engine
        state, playing = engine.bet(playing=3, bet=90, family='h')
        # Assert result
        assert (
            state['game-data']['leading-player'] == playing and
            state['game-data']['leading-bet'] == 90 and
            state['game-data']['game-type']['bet'] == 90 and
            state['game-data']['game-type']['family'] == 'h' and
            state['past']['bets'] == [
                [{'bet': -1, 'family': None}],
                [{'bet': -1, 'family': None}],
                [{'bet': 80, 'family': 's'}],
                [{'bet': 90, 'family': 'h'}]
            ] and playing == 0
        )


