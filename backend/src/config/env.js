import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4009),
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || 4009}`,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/study_sparkai',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  jwtResetSecret: process.env.JWT_RESET_SECRET || 'dev-reset-secret-change-me',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  passwordResetTtl: process.env.PASSWORD_RESET_TTL || '1h',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  ai: {
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY,
    defaultModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    reasoningModel: process.env.GROQ_REASONING_MODEL || 'llama-3.3-70b-versatile',
    explanationModel: process.env.GROQ_EXPLANATION_MODEL || 'gemma2-9b-it',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    enabled: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  },
  redis: {
    url: process.env.REDIS_URL,
    enabled: Boolean(process.env.REDIS_URL),
  },
  zoom: {
    accountId: process.env.ZOOM_ACCOUNT_ID,
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET,
    enabled: Boolean(process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET),
  },
};
