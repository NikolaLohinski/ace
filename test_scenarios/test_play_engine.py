class TestPlay(object):

    def test_simple_turn(self):
        from classes.Engine import Engine
        from classes.Card import Card
        engine = Engine(players=[1, 3, 2, 4], teams=[[0, 2], [1, 3]], dealer=1)
        engine.current_game_state['actors']['cards'] = [
            [Card('a,s'), Card('k,s'), Card('8,c'), Card('9,c'), Card('a,d'), Card('k,d')],
            [Card('9,s'), Card('a,c'), Card('k,c'), Card('j,c'), Card('q,d'), Card('10,d')],
            [Card('q,s'), Card('8,s'), Card('q,c'), Card('10,c'), Card('8,h', True)],
            [Card('j,s'), Card('7,s'), Card('10,s'), Card('8,d'), Card('7,d'), Card('9,d')],
        ]
        engine.current_game_state['past']['turns'] = [
            [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
            [Card('9,h', True), Card('7,d'), Card('j,d'), Card('a,h', True)],
            [Card('7,c')]
        ]
        engine.current_game_state['game-data']['type'] = 'game'
        engine.current_game_state['past']['bets'] = [
            ['110,h', None],
            [None, None],
            ['90,h', '120,h'],
            [None, None]
        ]
        state, playing, possibles = engine.play(playing=3, card_index=4)
        assert (
            state['past']['turns'] == [
                [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
                [Card('9,h', True), Card('7,d'), Card('j,d'), Card('a,h', True)],
                [Card('7,c'), Card('7,d')]
            ]
            and state['actors']['cards'] == [
               [Card('a,s'), Card('k,s'), Card('8,c'), Card('9,c'), Card('a,d'), Card('k,d')],
               [Card('9,s'), Card('a,c'), Card('k,c'), Card('j,c'), Card('q,d'), Card('10,d')],
               [Card('q,s'), Card('8,s'), Card('q,c'), Card('10,c'), Card('8,h', True)],
               [Card('j,s'), Card('7,s'), Card('10,s'), Card('8,d'), Card('9,d')],
            ]
            and playing == 0
            and possibles == [[2, 3], [1, 2, 3], [], []]
        )

    def test_start_game(self):
        from classes.Engine import Engine
        from classes.Card import Card
        engine = Engine(players=[1, 3, 2, 4], teams=[[0, 2], [1, 3]], dealer=1)
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
        engine.current_game_state['game-data']['type'] = 'game'
        state, playing, possibles = engine.play(playing=2, card_index=6)
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
            and possibles == [[7], [6, 7], [], [6]]
        )

    def test_end_turn(self):
        from classes.Engine import Engine
        from classes.Card import Card
        engine = Engine(players=[1, 3, 2, 4], teams=[[0, 2], [1, 3]], dealer=1)
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
        engine.current_game_state['game-data']['type'] = 'game'
        state, playing, possibles = engine.play(playing=3, card_index=1)
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
            and possibles == [[0], [0], [0], [0]]
        )

    def test_asset_cut_turn(self):
        from classes.Engine import Engine
        from classes.Card import Card
        engine = Engine(players=[1, 3, 2, 4], teams=[[0, 2], [1, 3]], dealer=1)
        engine.current_game_state['actors']['cards'] = [
            [Card('k,s', True), Card('j,s', True), Card('9,s', True), Card('j,h'),
             Card('a,h'), Card('q,d')],
            [Card('q,s', True), Card('a,s', True), Card('8,s', True), Card('7,s', True),
             Card('7,h'), Card('9,h'), ],
            [Card('7,c'), Card('8,c'), Card('9,c'), Card('a,c'),
             Card('10,c'), Card('10,h')],
            [Card('10,s'), Card('q,c'), Card('j,c'),
             Card('8,h'), Card('q,h')]
        ]
        engine.current_game_state['past']['turns'] = [
            [Card('a,d'), Card('8,d'), Card('j,d'), Card('10,d')],
            [Card('q,d'), Card('k,d'), Card('7,d'), Card('k,h')],
            [Card('k,c')]
        ]
        engine.current_game_state['game-data']['type'] = 'game'
        state, playing, possibles = engine.play(playing=0, card_index=0)
        assert (
            state['past']['turns'] == [
                [Card('a,d'), Card('8,d'), Card('j,d'), Card('10,d')],
                [Card('q,d'), Card('k,d'), Card('7,d'), Card('k,h')],
                [Card('k,c'), Card('k,s', True)]
            ]
            and state['actors']['cards'] == [
                [Card('j,s', True), Card('9,s', True), Card('j,h'),
                 Card('a,h'), Card('q,d')],
                [Card('q,s', True), Card('a,s', True), Card('8,s', True), Card('7,s', True),
                 Card('7,h'), Card('9,h'), ],
                [Card('7,c'), Card('8,c'), Card('9,c'), Card('a,c'),
                 Card('10,c'), Card('10,h')],
                [Card('10,s'), Card('q,c'), Card('j,c'),
                 Card('8,h'), Card('q,h')]
            ]
            and playing == 1
            and possibles == [
                [],
                [1],
                [0, 1, 2, 3, 4],
                []
            ]
        )

    def test_piss_possibles(self):
        from classes.Engine import Engine
        from classes.Card import Card
        engine = Engine(players=[0, 1, 2, 3], teams=[[0, 2], [1, 3]], dealer=1)
        engine.current_game_state['actors']['cards'] = [
            [Card('k,s', True), Card('j,s', True), Card('9,s', True), Card('j,h'),
             Card('a,h'), Card('q,d'), Card('7,d')],
            [Card('q,s', True), Card('a,s', True), Card('8,s', True), Card('7,s', True),
             Card('7,h'), Card('9,h'), Card('k,h')],
            [Card('7,c'), Card('8,c'), Card('9,c'), Card('a,c'),
             Card('10,c'), Card('10,h')],
            [Card('10,s'), Card('k,c'), Card('q,c'), Card('j,c'),
             Card('8,h'), Card('q,h'), Card('k,d')]
        ]
        engine.current_game_state['past']['turns'] = [
            [Card('a,d'), Card('8,d'), Card('j,d'), Card('10,d')],
            [Card('q,d')]
        ]
        engine.current_game_state['game-data']['type'] = 'game'
        state, playing, possibles = engine.play(playing=3, card_index=6)
        assert possibles == [
                [5, 6],
                [0, 1, 2, 3, 4, 5, 6],
                [],
                []
            ]

    def test_end_game(self):
        from classes.Engine import Engine
        from classes.Card import Card
        engine = Engine(players=[1, 3, 2, 4], teams=[[0, 2], [1, 3]], dealer=1)
        engine.current_game_state['actors']['cards'] = [
            [Card('k,s')],
            [],
            [],
            [],
        ]
        engine.current_game_state['past']['bets'] = [
            ['110,h', None],
            [None, None],
            ['90,h', '120,h'],
            [None, None]
        ]
        engine.current_game_state['past']['turns'] = [
            [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
            [Card('9,h', True), Card('10,h', True), Card('j,d'), Card('a,h', True)],
            [Card('7,c'), Card('7,d'), Card('8,c'), Card('k,c')],
            [Card('q,d'), Card('8,h', True), Card('8,d'), Card('k,d')],
            [Card('8,s'), Card('7,s'), Card('a,s'), Card('9,s')],
            [Card('a,d'), Card('10,d'), Card('10,c'), Card('9,d')],
            [Card('9,c'), Card('a,c'), Card('q,c'), Card('10,s')],
            [Card('j,c'), Card('q,s'), Card('j,s')]
        ]
        engine.current_game_state['past']['score'] = [113, 4]
        engine.current_game_state['game-data']['type'] = 'game'
        state, playing, possibles = engine.play(playing=0, card_index=0)
        assert (
            state['past']['turns'] == [
                [Card('j,h', True), Card('7,h', True), Card('k,h', True), Card('q,h', True)],
                [Card('9,h', True), Card('10,h', True), Card('j,d'), Card('a,h', True)],
                [Card('7,c'), Card('7,d'), Card('8,c'), Card('k,c')],
                [Card('q,d'), Card('8,h', True), Card('8,d'), Card('k,d')],
                [Card('8,s'), Card('7,s'), Card('a,s'), Card('9,s')],
                [Card('a,d'), Card('10,d'), Card('10,c'), Card('9,d')],
                [Card('9,c'), Card('a,c'), Card('q,c'), Card('10,s')],
                [Card('j,c'), Card('q,s'), Card('j,s'), Card('k,s')]
            ]
            and state['actors']['cards'] == [[], [], [], []]
            and playing == -1
            and state['past']['score'] == [113, 49]
            and possibles == [[], [], [], []]
            and state['game-data']['winner'] == 1
        )
