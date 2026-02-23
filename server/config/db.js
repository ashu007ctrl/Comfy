const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/comfy-ai');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.warn("Running in non-persistent mode (History will not be saved).");
        // process.exit(1); // Do not exit, allow app to run without DB
    }
};

module.exports = connectDB;
