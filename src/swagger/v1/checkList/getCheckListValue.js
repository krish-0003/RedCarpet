module.exports = {
  get: {
    tags: ['User CheckList Operations'],
    description:
      'This API endpoint retrieves the value of a checklist for a specific user by their user ID.',
    operationId: 'getCheckListValue',
    parameters: [
      {
        name: 'userId',
        in: 'path',
        type: 'string',
        required: true,
      },
    ],

    responses: {
      200: {
        description: `List of user's Checklist Value `,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    status: { type: 'string' },

                    CheckLists: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          checklist_title: { type: 'string' },
                          type: { type: 'string' },
                          UserCheckLists: {
                            type: 'object',
                            properties: {
                              id: { type: 'number' },
                              checklist_value: { type: 'boolean' },
                            },
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
