module.exports = {
  post: {
    tags: ['User Software Operations'],
    description:
      'This API endpoint allows to send an email notification to the manger of the software informing them that a request has been sent to revoke the access to a specific software for particular user by usersoftware ID.',
    oprationId: 'revoke-software-email',
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
      200: {
        description: 'Mail sent successfully.',
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
                          userSoftwareId: { type: 'number' },
                          message: { type: 'string' },
                          code: { type: 'number', example: 200 },
                          last_email_date: {
                            type: 'string',
                            format: 'date-time',
                          },
                        },
                      },
                    },
                    warning: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          userSoftwareId: { type: 'number' },
                          message: { type: 'string' },
                          code: { type: 'number', example: 429 },
                          type: {
                            type: 'string',
                            example: 'TooManyRequestsError',
                          },
                          field: { type: 'string' },
                        },
                      },
                    },
                    error: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          userSoftwareId: { type: 'number' },
                          message: { type: 'string' },
                          code: {
                            type: 'number',
                            example: [400, 404],
                          },
                          type: { type: 'string' },
                          field: { type: 'string' },
                        },
                      },
                    },
                  },
                },
                message: { type: 'string' },
                error: { type: 'boolean', example: false },
                code: { type: 'string', example: 200 },
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
