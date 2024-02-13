module.exports = {
  delete: {
    tags: ['User Software Operations'],
    description:
      'This API endpoint delete softwares assigned to a specific user.',
    oprationId: 'deleteUserSoftware',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userSoftwareIds: {
                type: 'array',
                items: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
    },

    responses: {
      202: {
        description: 'Deleted software list',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          message: { type: 'string' },
                          id: { type: 'number' },
                        },
                      },
                    },
                    error: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          errorType: { type: 'string' },
                          id: { type: 'number' },
                        },
                      },
                    },
                  },
                  message: { type: 'string' },
                  error: { type: 'boolean', example: false },
                  code: { type: 'integer', example: 202 },
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
