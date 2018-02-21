from time import time as UNIX_TIME_NOW


class Client(object):
    """Class to define a server client"""

    def __init__(self, socket, client_id):
        self.ts = int(UNIX_TIME_NOW())
        self.socket = socket
        self.id = client_id
        self.game_id = None

    def output(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'ts': self.ts
        }

