import path from 'path'
import swaggerJsDoc, { Options } from 'swagger-jsdoc'

const options: Options = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación API UnderSounds",
            version: '1.0.0',
            description: 'Descripción de los endpoints implementados'
        },
        servers: [
            {
                url: 'http://localhost:80/api'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT para acceder a la plataforma'
                }
            }
        }
    },
    apis: [path.join(__dirname, '../routes/*.ts'),]
}

export const swaggerSpec = swaggerJsDoc(options)