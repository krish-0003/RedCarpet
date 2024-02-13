module.exports = {
  get: {
    tags: ['Software Operations'],
    description:
      'This API endpoint retrieves a list of all available software  in the system.',
    oprationId: 'getSoftwares',
    parameters: [
      {
        name: 'searchText',
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
        description: 'List of all Softwares',
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
                      name: { type: 'string' },
                      status: { type: 'string' },
                      allocations: { type: 'string' },
                      icon: { type: 'string' },
                      Users: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            first_name: {
                              type: 'string',
                            },
                            last_name: {
                              type: 'string',
                            },
                            job_title: {
                              type: 'string',
                            },
                            company_email: {
                              type: 'string',
                            },
                            id: {
                              type: 'integer',
                            },
                          },
                        },
                      },
                    },
                  },
                },
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
