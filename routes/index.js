const commonRouter = require("./common");
const bannerRouter = require("./banners");
const genresRouter = require("./genres");
const countriesRouter = require("./countries");
const subscriptionsRouter = require("./subscriptions");
const billsRouter = require("./bills");
const usersRouter = require("./users");
const commentsRouter = require("./comments");
const artistsRouter = require("./artists");
const moviesRouter = require("./movies");
const episodesRouter = require("./episodes");
const keywordRouter = require("./keywords");
const authRouter = require("./auth");
const refreshTokenRouter = require("./refreshTokens");
const seoRouter = require("./seo");

function routes(app) {
  app.use("/api", commonRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/keywords", keywordRouter);
  app.use("/api/banners", bannerRouter);
  app.use("/api/genres", genresRouter);
  app.use("/api/countries", countriesRouter);
  app.use("/api/subscriptions", subscriptionsRouter);
  app.use("/api/bills", billsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/artists", artistsRouter);
  app.use("/api/movies", moviesRouter);
  app.use("/api/episodes", episodesRouter);
  app.use("/api/seo", seoRouter);
  app.use("/api/refresh-tokens", refreshTokenRouter);
}

module.exports = routes;
