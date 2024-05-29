import mongoose from "mongoose";

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';

const dbName = process.env.MONGO_DB_NAME || 'test';

mongoose.connect(`${url}/${dbName}`);

const db = mongoose.connection;

db.on('error', (error) => {
    console.log('ERROR: Could not connect to mongodb', error);
    process.exit(1);
});

db.on('open', () => {
    console.log('MongoDB connected succesfully');
});

export default db;
