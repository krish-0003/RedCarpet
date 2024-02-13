module.exports = {
  post: {
    tags: ['User Skill Operations'],
    description:
      'This API endpoint allows users to add their skills to their profile by their user ID.',
    operationId: 'addUserSkills',
    parameters: [
      {
        name: 'userId',
        in: 'path',
        type: 'string',
        required: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              skills: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },

    responses: {
      201: {
        description: `User's skills updated successfully.`,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    skills: {
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
      409: {
        description:
          'Conflict : Requested Object for post operation already exist in database.',
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
