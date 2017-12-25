import tornado.ioloop
import tornado.web
import os.path

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), '..', 'out'),
    static_path=os.path.join(os.path.dirname(__file__), '..', 'out'),
)


class Server(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


def make_app():
    return tornado.web.Application([
        (r"/", Server)
    ], **settings)


if __name__ == "__main__":
    port = 9000
    settings['debug'] = True
    app = make_app()
    app.listen(port)
    print('Initializing server...\nListening to http://127.0.0.1:{}/'.format(port))
    tornado.ioloop.IOLoop.current().start()

