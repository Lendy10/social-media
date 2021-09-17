const mongodb = require('mongoose');
const config = require('config');

const connectDB = async () => {
    try {
        await mongodb.connect(config.get('MONGO_URL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }, (err) => {
            if (!err) console.log("MongoDB Connected..");
        })
    } catch (err) {
        console.error(err);
        //exit process
        process.exit(1);
    }
}

module.exports = connectDB;