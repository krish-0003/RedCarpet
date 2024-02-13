module.exports = {
  get: {
    tags: ['Software Operations'],
    description:
      'This API endpoint retrieves a list of all clients in the system.',
    operationId: 'getAllClients',

    responses: {
      200: {
        description: `All clients.`,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
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
