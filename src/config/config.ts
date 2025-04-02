export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/undersounds',
    jwtSecret: process.env.JWT_SECRET || 'secretkey',
    jwtExpiration: '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};