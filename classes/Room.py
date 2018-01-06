import time


class Room(object):
    """Room class to define a play room"""
    def __init__(self, room_id):
        self.id = room_id
        self.ts = int(time.time())
        self.players = []

    def output(self):
        return {
            'id': self.id,
            'ts': self.ts,
            'players': self.players
        }

    def rm_player(self, player_id):
        index = next(
            (i for i, x in enumerate(self.players) if x['id'] == player_id)
            , None
        )
        if index is None:
            return False
        else:
            self.players.pop(index)
            return True

    def is_empty(self):
        return len(self.players) == 0
