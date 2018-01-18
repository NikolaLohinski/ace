import json
import os.path
from tornado import ioloop, web, websocket

from classes.Manager import Manager

_DEFAULT_PORT_ = 8080

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), '..', 'out'),
    static_path=os.path.join(os.path.dirname(__file__), '..', 'out'),
)


class RootServer(web.RequestHandler):
    def get(self):
        self.render('index.html')


class WSHandler(websocket.WebSocketHandler):
    """Tornado websocket handler"""

    def __init__(self, *args, manager, **kwargs):
        super(WSHandler, self).__init__(*args, **kwargs)
        self.manager = manager
        self.player_id = -1

    def open(self):
        """Called when a socket is opened."""

    def on_message(self, message):
        """Called when a socket transmitted a message."""
        action = json.loads(message)
        head = action.get('head')
        body = action.get('body')
        try:
            answer, destinations, own_msg = self.respond(head=head, body=body)
            # To always inform everyone before informing myself
            for handler in [d for d in destinations if d != self]:
                self.send(message=answer, handler=handler)
            if self in destinations:
                self.send(message=own_msg if own_msg else answer)
        except Exception as err:
            message = {
                'head': 'ERR',
                'body': err.args
            }
            self.send(message=message)

    def on_close(self):
        """Callend when a socket is closed."""
        print('Closing socket for player {}.'.format(self.player_id))

    def send(self, message, handler=None):
        try:
            h = handler
            if h is None:
                h = self
            h.write_message(json.dumps(message))
        except websocket.WebSocketClosedError:
            print('Ignore connection. Socket was killed.')

    def respond(self, head, body):
        answer = {}
        destinations = []
        own_msg = None
        if head == 'RESTART':
            self.player_id = body['player']['id']
            room = self.manager.revive_player(
                room_id=body['roomId'],
                player=body['player'],
                handler_instance=self
            )
            answer = {
                'head': 'ROOM',
                'body': room.output()
            }
            destinations.append(self)
        if head == 'INIT':
            name = body['name']
            player = self.manager.new_player(
                name=name,
                handler_instance=self
            )
            self.player_id = player['id']
            answer = {
                'head': 'PLY',
                'body': player
            }
            destinations.append(self)
        elif head == 'CREATE':
            room = self.manager.new_room(player=body)
            answer = {
                'head': 'ROOM',
                'body': room.output()
            }
            destinations.append(self)
        elif head == 'JOIN':
            room = self.manager.add_player(
                room_id=body['roomId'],
                player=body['player']
            )
            answer = {
              'head': 'ROOM',
              'body': room.output()
            }
            destinations = [self.manager.clients[p['id']] for p in room.players]
        elif head == 'RDY':
            room = self.manager.ready_player(
                room_id=body['roomId'],
                player_id=body['player']['id'],
                ready=body['ready']
            )
            answer = {
                'head': 'ROOM',
                'body': room.output()
            }
            destinations = [self.manager.clients[p['id']] for p in room.players]
        elif head == 'QUIT':
            room, players = self.manager.rm_player(player_id=self.player_id)
            if room is None:
                p = next(filter(lambda x: x['id'] == self.player_id, players))
                if p['admin']:
                    own_msg = {
                        'head': 'RESET'
                    }
                answer = {
                    'head': 'RESET',
                    'body': 'adminLeft'
                }
            else:
                answer = {
                    'head': 'ROOM',
                    'body': room.output()
                }
            destinations = [
                self.manager.clients.get(p['id'])
                for p in players
                if self.manager.clients.get(p['id'])
            ]
            if not destinations:
                destinations = [self]
        elif head == 'ALIVE':
            if not self.manager.is_alive(player_id=self.player_id):
                self.respond(head='QUIT', body=None)
                self.close()
        return answer, destinations, own_msg


def main(port=_DEFAULT_PORT_):
    manager = Manager()
    app = web.Application([
        (r'/ws', WSHandler, dict(manager=manager)),
        (r'/', RootServer),
        (r'/reach', RootServer),
        (r'/(.*)', web.StaticFileHandler, {
            'path': './out'
        }),
    ], **settings)
    app.listen(port)
    print('Initialized on http://localhost:{}/'.format(port))
    ioloop.IOLoop.current().start()


if __name__ == '__main__':
    settings['debug'] = True
    main()
