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
  subscriptionId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date(),
  status: Joi.string().valid('active', 'expired', 'cancelled').default('active'),
  total: Joi.number(),
  paymentMethod: Joi.string(),
});

const countrySchema = Joi.object({
  name: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  languages: Joi.array().items(Joi.string()),
  order: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const genreSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  languages: Joi.array().items(Joi.string()),
  order: Joi.number().default(0),
  isChildren: Joi.boolean().default(false),
  isHome: Joi.boolean().default(false),
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
  name: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  languages: Joi.array().items(Joi.string()),
  oldImage: Joi.string().uri().allow(''),
  imageUrl: Joi.string().uri(),
  roles: Joi.array().items(Joi.string()),
  bio: Joi.object({
    en: Joi.string().allow(''),
    vi: Joi.string().allow(''),
  }),
  country: Joi.string().required(),
  status: Joi.boolean().default(true),
});

const bannerSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  logoUrl: Joi.string().uri().required(),
  imageUrl: Joi.string().uri().required(),
  link: Joi.string().required(),
  order: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const episodeSchema = Joi.object({
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  image: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary(),
      filename: Joi.string(),
      mimetype: Joi.string(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  oldImage: Joi.string().uri().allow(''),
  imageUrl: Joi.object({
    en: Joi.string(),
    vi: Joi.string(),
  }),
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().allow(''),
    vi: Joi.string().allow(''),
  }),
  views: Joi.number().default(0),
  videoUrl: Joi.string().required(),
  season: Joi.number().default(0),
  number: Joi.number(),
  duration: Joi.number(),
  airDate: Joi.date(),
  status: Joi.boolean().default(true),
});

const movieSchema = Joi.object({
  imageUrl: Joi.object({
    en: Joi.string(),
    vi: Joi.string(),
  }),
  genres: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  cast: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  directors: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  requiredSubscriptions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  country: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.object({
    en: Joi.array().items(Joi.string()),
    vi: Joi.array().items(Joi.string()),
  }),
  isFree: Joi.boolean().default(true),
  minimumAge: Joi.number().default(0),
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().allow(''),
    vi: Joi.string().allow(''),
  }),
  releaseDate: Joi.date(),
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
  totalFavorites: Joi.number().default(0),
  totalComments: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const featureFilmSchema = Joi.object({
  imageUrl: Joi.object({
    en: Joi.string(),
    vi: Joi.string(),
  }),
  isFree: Joi.boolean().default(true),
  genres: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  cast: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  directors: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  requiredSubscriptions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  country: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.object({
    en: Joi.array().items(Joi.string()),
    vi: Joi.array().items(Joi.string()),
  }),
  minimumAge: Joi.number().default(0),
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().allow(''),
    vi: Joi.string().allow(''),
  }),
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
  totalFavorites: Joi.number().default(0),
  totalComments: Joi.number().default(0),
  status: Joi.boolean().default(true),
  videoUrl: Joi.string().required(),
});

const subscriptionSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  price: Joi.number().required(),
  duration: Joi.number().required(),
  benefits: Joi.object({
    en: Joi.array().items(Joi.string()),
    vi: Joi.array().items(Joi.string()),
  }),
  isFeatured: Joi.boolean().default(false),
  status: Joi.boolean().default(true),
});

const historySchema = Joi.object({
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  episodeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .default(null),
  minutes: Joi.number().required(),
  watchedAt: Joi.date().default(Date.now),
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
  imageUrl: Joi.string().uri(),
  oldImage: Joi.string().uri().allow(''),
  name: Joi.string().required(),
  role: Joi.string().valid('ADMIN', 'USER').default('USER'),
  email: Joi.string().email().required(),
  uid: Joi.string().required(),
  points: Joi.number().default(0),
  subscription: Joi.string().default(null),
  permissions: Joi.array().default(null),
  favoriteMovies: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .default([]),
  watchedList: Joi.array().items(historySchema).default([]),
  status: Joi.boolean().default(true),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  issuedAt: Joi.number().required(),
  expiresAt: Joi.number().required(),
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
  refreshTokenSchema,
};
