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
            answers = self.respond(head=head, body=body)
            for handler, answer in [d for d in answers]:
                self.send(message=answer, handler=handler)
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
        messages = []
        if head == 'RESTART':
            self.player_id = body['player']['id']
            messages.append((
                self,
                'ROOM',
                self.manager.revive_player(
                    room_id=body['roomId'],
                    player=body['player'],
                    handler_instance=self
                ).output())
            )
        if head == 'INIT':
            player = self.manager.new_player(
                name=body['name'],
                handler_instance=self
            )
            self.player_id = player['id']
            messages.append((
                self,
                'PLY',
                player
            ))
        elif head == 'CREATE':
            messages.append((
                self,
                'ROOM',
                self.manager.new_room(player=body).output()
            ))
        elif head == 'JOIN':
            messages = self.manager.add_player(
                room_id=body['roomId'],
                player=body['player']
            )
        elif head == 'RDY':
            messages = self.manager.ready_player(
                room_id=body['roomId'],
                player_id=body['player']['id'],
                ready=body['ready']
            )
        elif head == 'QUIT':
            messages = self.manager.rm_player(player_id=self.player_id)
        elif head == 'START':
            messages = self.manager.start_game(room_data=body['room'])
        return [
            (handler, {
                'head': head,
                'body': body
            }) for handler, head, body in messages
        ]


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
