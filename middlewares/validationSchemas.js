const Joi = require('joi');

const ageGroupSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  minimum: Joi.number().required(),
  status: Joi.boolean().default(true),
});

const replySchema = Joi.object({
  profileId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  comment: Joi.string().required(),
  likes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  dislikes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
});

const commentSchema = Joi.object({
  profileId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  comment: Joi.string(),
  likes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  dislikes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
  replies: Joi.array().items(replySchema),
});

const billSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  subscriptionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  status: Joi.string().valid('active', 'expired', 'cancelled').default('active'),
  total: Joi.number(),
  paymentMethod: Joi.string(),
});

const countrySchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  language: Joi.string(),
  currency: Joi.string(),
  telephone: Joi.number(),
  status: Joi.boolean().default(true),
});

const genreSchema = Joi.object({
  name: Joi.string().required(),
  isChildren: Joi.boolean().required().default(false),
  status: Joi.boolean().default(true),
});

const artistSchema = Joi.object({
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  name: Joi.string().required(),
  roles: Joi.array().items(Joi.string()),
  bio: Joi.string(),
  country: Joi.string().required(),
  status: Joi.boolean().default(true),
});

const bannerSchema = Joi.object({
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  link: Joi.string().required(),
  order: Joi.number().required().default(0),
  status: Joi.boolean().default(true),
});

const episodeSchema = Joi.object({
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  title: Joi.string(),
  description: Joi.string(),
  views: Joi.number().default(0),
  videoUrl: Joi.string().required(),
  season: Joi.number(),
  number: Joi.number(),
  duration: Joi.number(),
  airDate: Joi.date().iso(),
  status: Joi.boolean().default(true),
});

const infoSchema = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string(),
  slug: Joi.string().optional(),
});

const movieSchema = Joi.object({
  genres: Joi.array().items(infoSchema),
  country: infoSchema,
  cast: Joi.array().items(infoSchema),
  directors: Joi.array().items(infoSchema),
  minimumAge: Joi.number().default(0),
  title: Joi.string().required(),
  description: Joi.string(),
  releaseDate: Joi.date().required(),
  isSeries: Joi.boolean().default(false),
  duration: Joi.number(),
  rating: Joi.number(),
  imageUrl: Joi.string(),
  trailerUrl: Joi.string(),
  type: Joi.string().default('free'),
  tags: Joi.array().items(Joi.string()),
  totalFavorites: Joi.number().default(0),
  totalComments: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const profileSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  password: Joi.string(),
  isChildren: Joi.boolean().required().default(false),
  watchedMovies: Joi.array().items(
    Joi.object({
      movieId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      episodeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      minutesWatched: Joi.number().default(0),
      lastWatchedAt: Joi.date().iso().default(Date.now),
    }),
  ),
  favoriteMovies: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
});

const subscriptionSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  duration: Joi.number().required(),
  benefits: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean().default(false),
  status: Joi.boolean().default(true),
});

const userSchema = Joi.object({
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  fullName: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  UID: Joi.string().required(),
  points: Joi.number().default(0),
  subscriptionType: Joi.string().default('free'),
  profiles: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
});

module.exports = {
  ageGroupSchema,
  artistSchema,
  bannerSchema,
  billSchema,
  countrySchema,
  episodeSchema,
  genreSchema,
  commentSchema,
  movieSchema,
  profileSchema,
  subscriptionSchema,
  userSchema,
};
