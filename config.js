/**
 * Create and export configuration variables
 *
 */

// Determine which environment was passed as a command line argument
const dbCollection = process.env.DB_COLLECTION;
const dbConnectionUrl = process.env.DB_CONNECTION_STRING;
const PORT = process.env.PORT;

const config = {
    dbConnectionUrl,
    dbCollection,
    serverPort: PORT,
    hashingSecret: process.env.HASHING_SECRET,
    sendGrid: {
        key: process.env.SENDGRID_API_KEY,
    },
};

// Export the module
module.exports = config;
