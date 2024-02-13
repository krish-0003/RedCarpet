module.exports = {
  delete: {
    tags: ['Software Operations'],
    description:
      'This API endpoint allows to delete a specific software application from the system by its ID.',
    oprationId: 'deleteSoftware',
    parameters: [
      {
        name: 'softwareId',
        in: 'path',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Software Deleted successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: { type: 'string' },
                message: { type: 'string' },
                error: { type: 'string' },
                code: { type: 'string' },
                metadata: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        currentpage: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        totalResults: { type: 'integer' },
                      },
                    },
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
