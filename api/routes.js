import Engine from '../src/js/engine/Engine';

module.exports = (app, noLogging) => {
  // ------------------------------ Logging only -------------------------------
  if (!noLogging) {
    app.use((req, res, next) => {
      const params = [];
      for (const param in req.body) {
        if (req.body.hasOwnProperty(param)) {
          params.push(param);
        }
      }
      let log = `${req.method}: ${req.url}`;
      if (params.length) log += ` (with ${params.join(', ')})`;
      console.log(log);
      next();
    });
  }
  // ------------------------------- RAW routes --------------------------------
  app.get('/', (req, res) => res.send('OK'));
  app.post('/player', (req, res) => {
    res.send(req.body.player);
  });
  app.post('/game', (req, res) => {
    res.send(req.body.game);
  });
  app.post('/game/lastauction', (req, res) => {
    res.send(req.body.game.getLastAuction());
  });
  app.post('/engine/initialize', (req, res) => {
    res.send(Engine.init(req.body.game, req.body.players));
  });
  app.post('/engine/deal', (req, res) => {
    res.send(Engine.deal(req.body.game, req.body.hands));
  });
  app.post('/engine/bet', (req, res) => {
    res.send(Engine.bet(req.body.game, req.body.bet));
  });
  app.post('/engine/start', (req, res) => {
    res.send(Engine.start(req.body.game));
  });
  app.post('/engine/sort', (req, res) => {
    res.send(Engine.sort(req.body.cards, req.body.category));
  });
  app.post('/engine/nicesort', (req, res) => {
    res.send(Engine.niceSort(req.body.cards, req.body.category));
  });
  app.post('/engine/foldmaster', (req, res) => {
    res.send(Engine.foldMaster(req.body.game));
  });
  app.post('/engine/forbiddencards', (req, res) => {
    res.send(Engine.forbiddenCards(req.body.game, req.body.player));
  });
  app.post('/engine/play', (req, res) => {
    res.send(Engine.play(req.body.game, req.body.player));
  });
  app.post('/engine/restart', (req, res) => {
    res.send(Engine.restart(req.body.game));
  });
  // ---------------------------- Evolved routes -------------------------------
  app.post('/fastinit', (res, req) => {
    const r = Engine.init(req.body.game, req.body.players);
    res.send(Engine.deal(r['game']));
  });
  app.post('/init', (_, res) => res.redirect(307, '/engine/initialize'));
  app.post('/deal', (_, res) => res.redirect(307, '/engine/deal'));
  app.post('/bet', (_, res) => res.redirect(307, '/engine/bet'));
  app.post('/start', (_, res) => res.redirect(307, '/engine/start'));
  app.post('/play', (_, res) => res.redirect(307, '/engine/play'));
  app.post('/restart', (_, res) => res.redirect(307, '/engine/restart'));
};
