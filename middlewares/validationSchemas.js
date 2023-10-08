const Joi = require('joi');

const replySchema = Joi.object({
  replyId: Joi.string().allow(''),
  commentId: Joi.string().required(),
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  content: Joi.string().required(),
  likes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  dislikes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
});

const commentSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  content: Joi.string().required(),
  likes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  dislikes: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
  replies: Joi.array().items(replySchema).default([]),
});

const billSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  subscriptionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string().valid('active', 'expired', 'cancelled').default('active'),
  total: Joi.number().required(),
  paymentMethod: Joi.string(),
});

const countrySchema = Joi.object({
  name: Joi.string().required(),
  order: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const genreSchema = Joi.object({
  name: Joi.string().required(),
  order: Joi.number().default(0),
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
  name: Joi.string().required(),
  oldImage: Joi.string().uri().allow(''),
  roles: Joi.array().items(Joi.string()),
  bio: Joi.string().allow(''),
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
  oldImage: Joi.string().uri().allow(null),
  title: Joi.string().required(),
  description: Joi.string().required(),
  genres: Joi.any(),
  cast: Joi.any(),
  directors: Joi.any(),
  releaseDate: Joi.date().required(),
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
  title: Joi.string().required(),
  description: Joi.string(),
  views: Joi.number().default(0),
  videoUrl: Joi.string().required(),
  season: Joi.number().default(0),
  number: Joi.number().required(),
  duration: Joi.number().required(),
  airDate: Joi.date().required(),
  status: Joi.boolean().default(true),
});

const movieSchema = Joi.object({
  genres: Joi.any(),
  cast: Joi.any(),
  directors: Joi.any(),
  country: Joi.any(),
  tags: Joi.array().items(Joi.string()),
  minimumAge: Joi.number().default(0),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  releaseDate: Joi.date().required(),
  isSeries: Joi.boolean().default(false),
  duration: Joi.number(),
  rating: Joi.number(),
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
  trailerUrl: Joi.string(),
  type: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  totalFavorites: Joi.number().default(0),
  totalComments: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const featureFilmSchema = Joi.object({
  genres: Joi.any(),
  cast: Joi.any(),
  directors: Joi.any(),
  country: Joi.any(),
  tags: Joi.array().items(Joi.string()),
  minimumAge: Joi.number().default(0),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  releaseDate: Joi.date().required(),
  isSeries: Joi.boolean().default(false),
  duration: Joi.number(),
  rating: Joi.number(),
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
  trailerUrl: Joi.string(),
  type: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  status: Joi.boolean().default(true),
  videoUrl: Joi.string().required(),
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
  permissions: Joi.array().default(null),
  status: Joi.boolean().default(true),
});

module.exports = {
  replySchema,
  artistSchema,
  bannerSchema,
  billSchema,
  countrySchema,
  episodeSchema,
  genreSchema,
  commentSchema,
  movieSchema,
  subscriptionSchema,
  userSchema,
  featureFilmSchema,
};
