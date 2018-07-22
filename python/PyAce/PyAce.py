import json
import requests


class PyAce:

    game = None
    hands = dict()
    players = dict()

    def __init__(self, constants, host='localhost', port=8765):
        self.constants = constants
        self.host = host
        self.port = port
        self.base = 'http://{}:{}'.format(self.host, self.port)
        if self.get() == 'OK':
            print('Successfully connected to {}'.format(self.base))

    def get_game(self):
        return self.game

    def get(self, address='/'):
        return requests.get(self.base + address).text

    def post(self, address, body, format='json'):
        r = requests.post(self.base + address, json=body)
        try:
            if format == 'json':
                return r.json()
            else:
                return r.text
        except json.decoder.JSONDecodeError:
            raise Exception('Bad request, server returned :\n{}'.format(r.text))

    def init(self, players, dealer=None):
        """Initialize the game
        Params:
            players (list<dict>): list of players
            dealer (str): id of the dealer
        """
        if len(players) != 4:
            raise Exception('[PyAce.init] : Need 4 players to init game')
        if any(p.get('id') is None for p in players):
            raise Exception('[PyAce.init] : Every player needs an id')
        if dealer and len([p['id'] for p in players if p['id'] == dealer]) != 1:
            raise Exception('[PyAce.init] : Given dealer is not a player')
        r = self.post('/init', {
            'game': dict(dealer=dealer),
            'players': players
        })
        self.game = r.get('game')
        self.players = {
            p.get('_id'): p
            for p in r.get('players')
        }

    def deal(self, hands=None):
        r = self.post('/deal', dict(game=self.game, hands=hands))
        for identifier, player in self.players.items():
            player['_hand'] = r.get('hands').get(identifier)
        self.game = r.get('game')

    def bet(self, bet):
        if any((
                bet.get('id') is None,
                bet.get('type') is None,
                bet.get('type') == self.constants['BET'] and
                    (bet.get('price') is None or bet.get('category') is None)
        )):
            raise Exception('[PyAce.bet] : You need to provide type for a '
                            'pass or coinche, and additional price and category'
                            ' for a regular bet')
        r = self.post('/bet', dict(game=self.game, bet=bet))
        self.game = r.get('game')

    def start(self):
        r = self.post('/start', dict(game=self.game))
        self.game = r.get('game')

    def play(self, card):
        player = None
        for identifier, p in self.players.items():
            if card in p['_hand']:
                player = p
                player['_played'] = player['_hand'].pop(
                    player['_hand'].index(card)
                )
                break
        if player is None:
            raise Exception('[PyAce.play] : Impossible to determine who plays')
        r = self.post('/play', dict(game=self.game, player=player))
        self.game = r.get('game')

    def last_auction(self, game=None):
        if game is None:
            _game = self.game
        else:
            _game = game
        return self.post('/game/lastauction', dict(game=_game))

    def forbidden_cards(self, player_id):
        player = self.players.get(player_id)
        return self.post('/engine/forbiddencards', dict(game=self.game,
                                                        player=player))

    def fold_master(self):
        return self.post('/engine/foldmaster', dict(game=self.game),
                         format='text')
