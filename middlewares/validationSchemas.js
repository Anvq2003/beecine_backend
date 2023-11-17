const Joi = require("joi");

const replySchema = Joi.object({
  _id: Joi.string(),
  replyId: Joi.string().allow(""),
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
  _id: Joi.string(),
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
  _id: Joi.string(),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  subscriptionId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date(),
  status: Joi.string().valid("active", "expired", "cancelled").default("active"),
  total: Joi.number(),
  paymentMethod: Joi.string(),
});

const countrySchema = Joi.object({
  _id: Joi.string(),
  name: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  languages: Joi.array().items(Joi.string()),
  order: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const genreSchema = Joi.object({
  _id: Joi.string(),
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
  _id: Joi.string(),
  imageUrl: Joi.alternatives().try(
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
  oldImage: Joi.string().uri().allow(""),
  imageUrl: Joi.string().uri(),
  roles: Joi.array().items(Joi.string()),
  bio: Joi.object({
    en: Joi.string().allow(""),
    vi: Joi.string().allow(""),
  }),
  country: Joi.string().required(),
  status: Joi.boolean().default(true),
});

const bannerSchema = Joi.object({
  _id: Joi.string(),
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  imageUrl: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary(),
      filename: Joi.string(),
      mimetype: Joi.string(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  link: Joi.string().required(),
  order: Joi.number().default(0),
  status: Joi.boolean().default(true),
});

const episodeSchema = Joi.object({
  _id: Joi.string(),
  movieId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  imageUrl: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary(),
      filename: Joi.string(),
      mimetype: Joi.string(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().allow(""),
    vi: Joi.string().allow(""),
  }),
  views: Joi.number().default(0),
  videoUrl: Joi.optional().default(null),
  season: Joi.number().default(0),
  number: Joi.number(),
  duration: Joi.number(),
  airDate: Joi.date(),
  status: Joi.boolean().default(true),
});

const movieSchema = Joi.object({
  _id: Joi.string(),
  videoUrl: Joi.optional().default(null),
  genres: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  cast: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  directors: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  requiredSubscriptions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  country: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  tags: Joi.array().items(Joi.string()),
  isFree: Joi.boolean().default(true),
  minimumAge: Joi.number().default(0),
  title: Joi.object({
    en: Joi.string().required(),
    vi: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().allow(""),
    vi: Joi.string().allow(""),
  }),
  releaseDate: Joi.date(),
  isSeries: Joi.boolean().default(false),
  duration: Joi.number(),
  rating: Joi.number(),
  imageUrl: Joi.alternatives().try(
    Joi.object({
      file: Joi.binary().required(),
      filename: Joi.string().required(),
      mimetype: Joi.string().required(),
    }),
    Joi.string().uri(),
    Joi.any(),
  ),
  views: Joi.number().default(0),
  trailerUrl: Joi.string(),
  status: Joi.boolean().default(true),
});


const subscriptionSchema = Joi.object({
  _id: Joi.string(),
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
  _id: Joi.string(),
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
  _id: Joi.string(),
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
  oldImage: Joi.string().uri().allow(""),
  name: Joi.string().required(),
  role: Joi.string().valid("ADMIN", "USER").default("USER"),
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
const userAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("ADMIN", "USER").default("USER"),
  permissions: Joi.array().default(null),
  status: Joi.boolean().default(true),
});

const refreshTokenSchema = Joi.object({
  _id: Joi.string(),
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
  refreshTokenSchema,
  userAdminSchema,
};
