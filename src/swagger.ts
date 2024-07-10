import swaggerJSDoc from 'swagger-jsdoc'
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NOTEFLOW API',
    description: 'API Documentation',
    version: '1.0.0',
  },
  components: {
    securitySchemas: {
      Authorization: {
        type: 'apiKey',
        in: 'header',
        description:
          'All requests to the API should contain an Authoraization header with your API Token:NOTE [Add Bearer before token]',
        name: 'Authorization',
      },
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1',
      description: 'Developement server',
    },
  ],
}
const options = {
  swaggerDefinition,
  apis: ['src/swagger/**/*.ts'],
}
const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec
