var config = {
    development: {
        //mongodb connection settings
        database: {
            url : "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority",
            options :  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true },
            db:     'LocationHistory'
        }
    },
    production: {
        //mongodb connection settings
        database: {
            url : "mongodb+srv://mitesh:miteshpatel@cluster0-eqn0k.mongodb.net/test?retryWrites=true&w=majority",
            options :  { useUnifiedTopology: true, keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true },
            db:     'LocationHistory'
        }
    }
    };
    module.exports = config;