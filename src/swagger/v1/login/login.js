module.exports = {
  post: {
    tags: ['Authentication Operation'],
    description:
      'This API endpoint allows users to login and receive an access token for accessing protected resources.',
    operationId: 'login',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: { type: 'string' },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successfully logged in.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        email: { type: 'string', format: 'email' },
                        family_name: { type: 'string' },
                        given_name: { type: 'string' },
                        name: { type: 'string' },
                        picture: { type: 'string' },
                        usedId: { type: 'integer' },
                      },
                    },
                    accessToken: { type: 'string' },
                    expiresAt: { type: 'string', format: 'date-time' },
                  },
                },
                message: { type: 'string' },
                error: { type: 'boolean', example: false },
                code: { type: 'string' },
                metadata: {
                  type: 'object',
                  properties: {
                    currentPage: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalResults: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
      400: {
        description:
          'Bad Request : There are problems with the request body format.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
          },
        },
      },
      403: {
        description:
          'Forbidden : The server understood the request, but the user or client does not have access to the requested resource.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
          },
        },
      },
      404: {
        description:
          'Not Found : The requested resource could not be found on the server. ',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
          },
        },
      },

      500: {
        description:
          'Internal Server Error : The server encountered an error while processing the request.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
          },
        },
      },
    },
  },
};
