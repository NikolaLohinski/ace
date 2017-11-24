class TestPlay(object):

    def test_simple_turn(self):
        from classes.Engine import Engine
        from classes.Card import Card
        players = [12, 34, 56, 78]
        teams = [[0, 2], [1, 3]]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['actors']['cards'] = [
            [Card('a,s'), Card('k,s'), Card('8,c'), Card('9,c'), Card('a,d'), Card('k,d')],
            [Card('9,s'), Card('a,c'), Card('k,c'), Card('j,c'), Card('q,d'), Card('10,d')],
            [Card('q,s'), Card('8,s'), Card('q,c'), Card('10,c'), Card('8,h', True)],
            [Card('j,s'), Card('7,s'), Card('10,s'), Card('8,d'), Card('7,d'), Card('9,d')],
        ]
        engine.current_game_state['past']['turns'] = [
            [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
            [Card('9,h', True), Card('7,d'), Card('j,d'), Card('a,h', True)],
            [Card('7,s')]
        ]
        engine.current_game_state['past']['score'] = [64, 0]
        engine.current_game_state['game-data']['dealer'] = 1
        engine.current_game_state['game-data']['type'] = 'game'
        engine.current_game_state['past']['bets'] = [
            ['110,h', None],
            [None, None],
            ['90,h', '120,h'],
            [None, None]
        ]
        playing = 3
        card_index = 4
        state, playing, possibles = engine.play(playing=playing, card_index=card_index)
        assert (
            state['past']['turns'] == [
                [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
                [Card('9,h', True), Card('7,d'), Card('j,d'), Card('a,h', True)],
                [Card('7,s'), Card('7,d')]
            ]
            and state['actors']['cards'] == [
               [Card('a,s'), Card('k,s'), Card('8,c'), Card('9,c'), Card('a,d'), Card('k,d')],
               [Card('9,s'), Card('a,c'), Card('k,c'), Card('j,c'), Card('q,d'), Card('10,d')],
               [Card('q,s'), Card('8,s'), Card('q,c'), Card('10,c'), Card('8,h', True)],
               [Card('j,s'), Card('7,s'), Card('10,s'), Card('8,d'), Card('9,d')],
            ]
            and playing == 0
            # and possibles == [
            #     [2, 3],
            #     [1, 2, 3],
            #     [],
            #     []
            # ]
        )

    def test_start_game(self):
        from classes.Engine import Engine
        from classes.Card import Card
        players = [12, 34, 56, 78]
        teams = [[0, 2], [1, 3]]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['actors']['cards'] = [
            [Card('a,s'), Card('k,s'), Card('8,c'), Card('9,c'),
                Card('a,d'), Card('k,d'), Card('j,d'), Card('k,h', True)],
            [Card('9,s'), Card('a,c'), Card('k,c'), Card('j,c'),
                Card('q,d'), Card('10,d'), Card('a,h', True), Card('q,h', True)],
            [Card('q,s'), Card('8,s'), Card('q,c'), Card('10,c'),
                Card('7,c'), Card('8,h', True), Card('j,h', True), Card('9,h', True)],
            [Card('j,s'), Card('7,s'), Card('10,s'), Card('8,d'),
                Card('7,d'), Card('9,d'), Card('7,h', True), Card('7,d')],
        ]
        engine.current_game_state['past']['score'] = [0, 0]
        engine.current_game_state['game-data']['dealer'] = 1
        engine.current_game_state['game-data']['type'] = 'game'
        engine.current_game_state['past']['bets'] = [
            ['110,h', None],
            [None, None],
            ['90,h', '120,h'],
            [None, None]
        ]
        playing = 2
        card_index = 6
        state, playing, possibles = engine.play(playing=playing, card_index=card_index)
        assert (
            state['past']['turns'] == [
                [Card('j,h', True)]
            ]
            and state['actors']['cards'] == [
                [Card('a,s'), Card('k,s'), Card('8,c'), Card('9,c'),
                    Card('a,d'), Card('k,d'), Card('j,d'), Card('k,h', True)],
                [Card('9,s'), Card('a,c'), Card('k,c'), Card('j,c'),
                    Card('q,d'), Card('10,d'), Card('a,h', True), Card('q,h', True)],
                [Card('q,s'), Card('8,s'), Card('q,c'), Card('10,c'),
                    Card('7,c'), Card('8,h', True), Card('9,h', True)],
                [Card('j,s'), Card('7,s'), Card('10,s'), Card('8,d'),
                    Card('7,d'), Card('9,d'), Card('7,h', True), Card('7,d')],
            ]
            and playing == 3
            # and possibles == [
            #     [7],
            #     [6, 7],
            #     [],
            #     [6]
            # ]
        )

    def test_end_turn(self):
        from classes.Engine import Engine
        from classes.Card import Card
        players = [12, 34, 56, 78]
        teams = [[0, 2], [1, 3]]
        engine = Engine(players=players, teams=teams)
        engine.current_game_state['actors']['cards'] = [
            [Card('k,s')],
            [Card('j,c')],
            [Card('q,s')],
            [Card('j,s'), Card('10,s')],
        ]
        engine.current_game_state['past']['turns'] = [
            [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
            [Card('9,h', True), Card('10,h', True), Card('j,d'), Card('a,h', True)],
            [Card('7,c'), Card('7,d'), Card('8,c'), Card('k,c')],
            [Card('q,d'), Card('8,h', True), Card('8,d'), Card('k,d')],
            [Card('8,s'), Card('7,s'), Card('a,s'), Card('9,s')],
            [Card('a,d'), Card('10,d'), Card('10,c'), Card('9,d')],
            [Card('9,c'), Card('a,c'), Card('q,c')]
        ]
        engine.current_game_state['past']['score'] = [113, 4]
        engine.current_game_state['game-data']['dealer'] = 1
        engine.current_game_state['game-data']['type'] = 'game'
        engine.current_game_state['past']['bets'] = [
            ['110,h', None],
            [None, None],
            ['90,h', '120,h'],
            [None, None]
        ]
        playing = 3
        card_index = 1
        state, playing, possibles = engine.play(playing=playing, card_index=card_index)
        assert (
            state['past']['turns'] == [
                [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
                [Card('9,h', True), Card('10,h', True), Card('j,d'), Card('a,h', True)],
                [Card('7,c'), Card('7,d'), Card('8,c'), Card('k,c')],
                [Card('q,d'), Card('8,h', True), Card('8,d'), Card('k,d')],
                [Card('8,s'), Card('7,s'), Card('a,s'), Card('9,s')],
                [Card('a,d'), Card('10,d'), Card('10,c'), Card('9,d')],
                [Card('9,c'), Card('a,c'), Card('q,c'), Card('10,s')]
            ]
            and state['actors']['cards'] == [
                [Card('k,s')],
                [Card('j,c')],
                [Card('q,s')],
                [Card('j,s')],
            ]
            and playing == 1
            and state['past']['score'] == [113, 28]
            # and possibles == [
            #     [7],
            #     [6, 7],
            #     [],
            #     [6]
            # ]
        )

