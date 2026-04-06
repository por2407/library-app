module.exports = {
    cfg : {
        port: process.env.PORT,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        databaseUrl: process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
    }
}