module.exports = {
  get: {
    tags: ['User History Operations'],
    description:
      'This API endpoint retrieves a specific users history by their user ID, for any relevant actions.',
    oprationId: 'getUserById',
    parameters: [
      {
        name: 'userId',
        in: 'path',
        schema: {
          type: 'integer',
        },
      },
      {
        name: 'limit',
        in: 'query',
        schema: {
          type: 'integer',
        },
      },
    ],
    responses: {
      200: {
        description: 'User information',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    action: { type: 'string' },
                    field: { type: 'string' },
                    timestamp: { type: 'string' },
                    action_by: { type: 'integer' },
                    description: { type: 'string' },
                  },
                },
                message: { type: 'string' },
                error: { type: 'boolean', example: false },
                code: { type: 'string' },
                metadata: { type: 'object' },
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
