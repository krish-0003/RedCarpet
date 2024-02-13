module.exports = {
  get: {
    tags: ['User Software Operations'],
    description:
      'This API endpoint retrieves a list of users assigned to a specific software  by Software ID.',
    oprationId: 'getSoftwareUsers',
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
        description: 'List of assigned software to User.',
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
                      status: {
                        type: 'string',
                      },
                      note: {
                        type: 'object',
                        properties: {
                          active: {
                            type: 'object',
                            properties: {
                              note: {
                                type: 'string',
                              },
                              timestamp: {
                                type: 'string',
                                format: 'date-time',
                              },
                            },
                          },
                          revoked: {
                            type: 'object',
                            properties: {
                              note: {
                                type: 'string',
                              },
                              timestamp: {
                                type: 'string',
                                format: 'date-time',
                              },
                            },
                          },
                        },
                      },
                      assignDate: {
                        type: 'string',
                        format: 'date-time',
                      },
                      User: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                          },
                          first_name: {
                            type: 'string',
                          },
                          last_name: {
                            type: 'string',
                          },
                          job_title: {
                            type: 'string',
                          },
                        },
                      },
                    },
                    required: [
                      'userId',
                      'userSoftwareId',
                      'first_name',
                      'last_name',
                      'job_title',
                      'status',
                      'note',
                      'assignDate',
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
