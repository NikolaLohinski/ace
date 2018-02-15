import time

from classes.Game import Game


class Room(object):
    """Room class to define a play room"""
    def __init__(self, room_id, admin_id):
        self.id = room_id
        self.ts = int(time.time())
        self.players = []
        self.admin_id = admin_id
        self.game = None

    def output(self):
        output = {
            'id': self.id,
            'ts': self.ts,
            'players': self.players,
            'adminId': self.admin_id,
        }
        if self.game is not None:
            output['game'] = self.game
        return output

    def rm_player(self, player_id):
        index = next(
            (i for i, x in enumerate(self.players) if x['id'] == player_id)
            , None
        )
        if index is None or player_id == self.admin_id:
            return False
        else:
            self.players.pop(index)
            return True

    def start_game(self, data):
        dealer = data['players'][0]['id']
        if dict(data).get('dealer'):
            dealer = data['dealer']
        team_1 = [
            data['players'][0]['id'],
            data['players'][2]['id']
        ]
        if dict(data).get('firstTeam'):
            team_1 = data['firstTeam']
        self.game = Game(
            players=[x['id'] for x in data['players']],
            team1=team_1,
            dealer=dealer
        )

    def is_empty(self):
        return len(self.players) == 0
