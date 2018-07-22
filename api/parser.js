import Game from '../src/js/engine/Game';
import Player from '../src/js/engine/Player';

module.exports = (app) => {
  app.use((req, res, next) => {
    if (req.body.game) {
      req.body.game = new Game(req.body.game);
    }
    if (req.body.player) {
      req.body.player = new Player(req.body.player);
    }
    if (req.body.players) {
      req.body.players = req.body.players.map((p) => new Player(p));
    }
    next();
  });
};
