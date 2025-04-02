import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/undersounds';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB conectado correctamente');
    } catch (error: any) {
        console.error(`Error al conectar MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;