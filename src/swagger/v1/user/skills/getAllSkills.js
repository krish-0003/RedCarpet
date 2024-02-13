module.exports = {
  get: {
    tags: ['User Skill Operations'],
    description:
      'This API endpoint retrieves a list of all available skills in the system.',
    operationId: 'getAllSkills',

    responses: {
      200: {
        description: `All skills.`,
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
