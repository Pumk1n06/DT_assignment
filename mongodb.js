import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


const uri = process.env.MONGO_URI
const dbName = "Events"; 

const connectMongoDB = async () => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        return { client, db };
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
};

export default connectMongoDB;