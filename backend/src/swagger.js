const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Saffron POS API',
            version: '1.0.0',
            description: 'API documentation for the Saffron POS system',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/docs/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = specs