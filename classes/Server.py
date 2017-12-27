from tornado import ioloop, web, websocket
from threading import Thread
import time
import json
import os.path

_DEFAULT_PORT_ = 8080
_DEFAULT_HOST_ = '127.0.0.1'

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), '..', 'out'),
    static_path=os.path.join(os.path.dirname(__file__), '..', 'out'),
)


class Server(web.RequestHandler):
    def get(self):
        self.render('index.html')


class WSHandler(websocket.WebSocketHandler):
    """Tornado websocket handler"""
    def open(self):
        """Called when a socket is opened."""
        print('Connection opened')

    def on_message(self, message):
        """Called when a socket transmitted a message."""
        action = json.loads(message)
        head = action['head']
        body = action['body']
        if head == 'INIT':
            name = body['name']
            # Convert name into an integer code
            code = int(''.join([str(ord(c)) for c in list(name)])) % 100000
            # Get current time's 5 last digits
            time_code = int(time.time()) % 100000
            # Combine those 2 to create a hopefully unique identifier
            id_player = str(time_code) + str(code)
            message = {
                'head': 'IDPLY',
                'body': {
                    'name': name,
                    'id': id_player
                }
            }
            try:
                self.write_message(json.dumps(message))
            except websocket.WebSocketClosedError:
                print('Ignore connection. Socket was killed before it initialized.')
        elif head == 'CREATE':
            time_code = int(time.time()) % 1000000
            id_player = body['idPlayer']
            id_game = time_code + id_player % 100000
            try:
                message = {
                    'head': 'IDGAME',
                    'body': {
                        'id': id_game
                    }
                }
                self.write_message(json.dumps(message))
            except websocket.WebSocketClosedError:
                print('Ignore connection. Socket was killed.')

    def on_close(self):
        """Callend when a socket is closed."""
        print('Connection closed')


def main():
    app = web.Application([
        (r'/ws', WSHandler),
        (r'/', Server),
        (r'/(.*)', web.StaticFileHandler, {
            'path': './out'
        }),
    ], **settings)
    app.listen(_DEFAULT_PORT_)
    print('Initializing server...\nListening to http://{}:{}/'.format(_DEFAULT_HOST_, _DEFAULT_PORT_))
    ioloop.IOLoop.current().start()

if __name__ == '__main__':
    settings['debug'] = True
    main()

