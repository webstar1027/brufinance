require('dotenv').config();

const env = process.env.NODE_ENV;

const requireProcessEnv = (name) => {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
};

const settings = {
    base: {
        env: requireProcessEnv('NODE_ENV'),
        host: '0.0.0.0',
    },
    development: {
        mongo: {
            uri: process.env.MONGO_DEV_URI,
            name: 'UAT',
        },
        port: 3000,
    },
    production: {
        mongo: {
            uri: process.env.MONGO_PROD_URI,
            name: 'PROD',
        },
        port: 3000,
    },
    uat: {
        mongo: {
            uri: process.env.MONGO_UAT_URI,
            name: 'UAT',
        },
        port: 3101,
    },
};
module.exports = Object.assign(settings.base, settings[env]);
