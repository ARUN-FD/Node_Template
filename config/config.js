require('dotenv').config()//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'development'
CONFIG.port = process.env.PORT || '3100'
CONFIG.db_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/PEM'
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change'
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '50000'

CONFIG.userType = ["User","Admin","Store"];

module.exports = CONFIG