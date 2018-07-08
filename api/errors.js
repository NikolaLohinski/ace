module.exports = (app) => {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.toString());
    next();
  });
};
