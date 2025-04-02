// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import { errorHandler } from './middleware/error';

// Importar rutas
import userRoutes from './routes/userRoutes';
import artistRoutes from './routes/artistRoutes';
import albumRoutes from './routes/albumRoutes';
import songRoutes from './routes/songRoutes';
import genreRoutes from './routes/genreRoutes';
import formatRoutes from './routes/formatRoutes';
import scoreRoutes from './routes/scoreRoutes';
//import shopRoutes from './routes/shopRoutes'; -- TO-DO
//import cartRoutes from './routes/cartRoutes'; -- TO-DO
//import checkoutRoutes from './routes/checkoutRoutes'; -- TO-DO
//import orderRoutes from './routes/orderRoutes'; -- TO-DO
import addressRoutes from './routes/addressRoutes';
import paymentRoutes from './routes/paymentRoutes';
import searchRoutes from './routes/searchRoutes';
//import libraryRoutes from './routes/libraryRoutes'; -- TO-DO
//import statsRoutes from './routes/statsRoutes'; -- TO-DO
import reproductionRoutes from './routes/reproductionRoutes';
//import profileRoutes from './routes/profileRoutes'; -- TO-DO

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(helmet()); // Seguridad para cabeceras HTTP
app.use(morgan('dev')); // Logging de solicitudes HTTP

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Undersounds',
            version: '1.0.0',
            description: 'Documentación de la API de Undersounds - Plataforma de música'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        './src/routes/*.ts',
        './src/models/*.ts',
        './src/middleware/*.ts'
    ]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/formats', formatRoutes);
app.use('/api/scores', scoreRoutes);
//app.use('/api/shop', shopRoutes);
//app.use('/api/cart', cartRoutes);
//app.use('/api/checkout', checkoutRoutes);
//app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);
//app.use('/api/library', libraryRoutes);
//app.use('/api/stats', statsRoutes);
app.use('/api/reproductions', reproductionRoutes);
//app.use('/api/profiles', profileRoutes);

// Ruta inicial
app.get('/', (req, res) => {
    res.json({
        message: 'API de Undersounds funcionando correctamente',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});