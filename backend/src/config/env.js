module.exports = {
    cfg : {
        port: process.env.PORT,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        databaseUrl: process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        redis: process.env.REDIS_URL,
        // Comma-separated list of allowed CORS origins, e.g. "http://localhost:3000,https://myapp.com"
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
            : [],
    }
}