const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.warn('Warning: MONGO_URI is not defined. Persistent storage will not be available.');
        return;
    }
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
