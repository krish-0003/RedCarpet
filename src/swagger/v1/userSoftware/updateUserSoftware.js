module.exports = {
  patch: {
    tags: ['User Software Operations'],
    description:
      'This API endpoint allows to update a specific users access to a software, such as changing their permission level or revoking their access, by their usersoftware  ID.',
    oprationId: 'updateUserSoftware',
    parameters: [
      {
        name: 'userSoftwareId',
        in: 'path',
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              note: { type: 'string' },
              username: { type: 'string' },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'data updated in database successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                    },
                    software_id: {
                      type: 'string',
                    },
                    user_id: {
                      type: 'string',
                    },
                    assign_date: {
                      type: 'string',
                      format: 'date-time',
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
                    status: {
                      type: 'string',
                      enum: ['assigned', 'revoked'],
                    },
                    username: {
                      type: 'string',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                    createdBy: {
                      type: 'string',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                    updatedBy: {
                      type: 'string',
                    },
                  },
                  required: [
                    'id',
                    'software_id',
                    'user_id',
                    'assign_date',
                    'note',
                    'status',
                    'username',
                    'createdAt',
                    'createdBy',
                    'updatedAt',
                    'updatedBy',
                  ],
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
