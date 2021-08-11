const config = require('config');
const MONGO_URL = config.get('MONGODB_URL');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Mongo DB is Connected..");
    } catch (err) {
        console.error(err, new Error('Something has gone wrong'));
        //exit code
        process.exit(1);
    }
}

module.exports = connectDB;