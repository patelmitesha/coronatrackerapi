var config = {
    development: {
        //mongodb connection settings
        database: {
            url : "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority",
            options :  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true },
            db:     'LocationHistory'
        },
        googleauthclientid : "541393556865-h58ggrbjrcaorgd6rof75p9tdm3ir9ha.apps.googleusercontent.com"
    },
    production: {
        //mongodb connection settings
        database: {
            url : "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority",
            options :  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true },
            db:     'LocationHistory'
        },
        googleauthclientid : "541393556865-h58ggrbjrcaorgd6rof75p9tdm3ir9ha.apps.googleusercontent.com"
    }
    };
    module.exports = config;