module.exports = {
  get: {
    tags: ['User Operations'],
    description:
      'This API endpoint retrieves a list of all users in the system.',
    oprationId: 'getUsers',
    parameters: [
      {
        name: 'searchText',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'location',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'status',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'workAllocation',
        in: 'query',
        schema: {
          type: 'integer',
        },
      },
      {
        name: 'orderBy',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'order',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'role[]',
        in: 'query',
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      {
        name: 'page',
        in: 'query',
        schema: {
          type: 'integer',
        },
      },
      {
        name: 'pageSize',
        in: 'query',
        schema: {
          type: 'integer',
        },
      },
    ],
    responses: {
      200: {
        description: 'List of all users',
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
                      id: { type: 'integer' },
                      employee_id: { type: 'string' },
                      first_name: { type: 'string' },
                      last_name: { type: 'string' },
                      capacity: { type: 'integer' },
                      job_title: { type: 'string' },
                      status: { type: 'string' },
                      company_email: { type: 'string', format: 'email' },
                      createdAt: { type: 'string', format: 'date-time' },
                      Branch: {
                        type: 'object',
                        properties: {
                          branch_name: {
                            type: 'string',
                          },
                        },
                      },
                      UserRole: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                          },
                          role: {
                            type: 'string',
                          },
                        },
                      },
                      Skills: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
                message: {
                  type: 'string',
                },
                error: {
                  type: 'string',
                },
                code: {
                  type: 'integer',
                },
                metadata: {
                  type: 'object',
                  properties: {
                    currentPage: {
                      type: 'integer',
                    },
                    totalPages: {
                      type: 'integer',
                    },
                    totalResults: {
                      type: 'integer',
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
