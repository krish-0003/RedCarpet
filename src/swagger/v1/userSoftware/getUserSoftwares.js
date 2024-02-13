module.exports = {
  get: {
    tags: ['User Software Operations'],
    description:
      'This API endpoint retrieves a list of softwares assigned to a specific user by their user ID.',
    oprationId: 'getUserSoftwares',
    parameters: [
      {
        name: 'userId',
        in: 'path',
        schema: {
          type: 'string',
        },
      },
    ],

    responses: {
      200: {
        description: 'Assigned Software List',
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
                        type: 'integer',
                      },
                      note: {
                        type: 'string',
                      },
                      status: {
                        type: 'string',
                      },
                      assignDate: {
                        type: 'string',
                        format: 'date-time',
                      },
                      username: {
                        type: 'string',
                      },
                      Software: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                          },
                          icon: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },

                          managed_by: {
                            type: 'array',
                            items: { type: 'number' },
                          },
                        },
                      },
                    },
                    required: [
                      'softwareId',
                      'userSoftwareId',
                      'icon',
                      'name',
                      'note',
                      'assignDate',
                      'status',
                    ],
                  },
                },
                message: {
                  type: 'string',
                },
                error: {
                  type: 'boolean',
                },
                code: {
                  type: 'integer',
                  enum: [200, 201, 404, 422, 500],
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
              required: ['data', 'message', 'error', 'code', 'metadata'],
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
