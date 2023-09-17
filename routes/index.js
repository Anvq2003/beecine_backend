const commonRouter = require('./common');
const bannerRouter = require('./banners');
const genresRouter = require('./genres');
const subscriptionsRouter = require('./subscriptions');
const billsRouter = require('./bills');
const usersRouter = require('./users');
const commentsRouter = require('./comments');
const profilesRouter = require('./profiles');
const ageGroupsRouter = require('./ageGroups');
const artistsRouter = require('./artists');
const moviesRouter = require('./movies');
const episodesRouter = require('./episodes');
const featureFilmRouter = require('./featureFilm');

function routes(app) {
  app.use('/', commonRouter);
  app.use('/api/banners', bannerRouter);
  app.use('/api/genres', genresRouter);
  app.use('/api/subscriptions', subscriptionsRouter);
  app.use('/api/bills', billsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/profiles', profilesRouter);
  app.use('/api/age-groups', ageGroupsRouter);
  app.use('/api/artists', artistsRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/episodes', episodesRouter);
  app.use('/api/feature-film', featureFilmRouter);
}

module.exports = routes;
