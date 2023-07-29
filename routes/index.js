const genresRouter = require('./genres');
const countriesRouter = require('./countries');
const subscriptionsRouter = require('./subscriptions');
const userSubscriptionsRouter = require('./userSubscriptions');
const bannerRouter = require('./banners');
const usersRouter = require('./users');

function routes(app) {
  app.use('/api/genres', genresRouter);
  app.use('/api/countries', countriesRouter);
  app.use('/api/banners', bannerRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/subscriptions', subscriptionsRouter);
  app.use('/api/userSubscriptions', userSubscriptionsRouter);
}

module.exports = routes;
