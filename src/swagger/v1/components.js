module.exports = {
  components: {
    schemas: {
      error: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                type: { type: 'string' },
                field: { type: 'string' },
                message: { type: 'string' },
                type: { type: 'string' },
                field: { type: 'string' },
              },
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
};
