module.exports = {
  patch: {
    tags: ['Software Operations'],
    description:
      'This API endpoint allows to update a specific software applications information by its ID.',
    oprationId: 'UpdateSoftware',
    parameters: [
      {
        name: 'softwareId',
        in: 'path',
        type: 'number',
        required: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' },
              icon: { type: 'string' },
              status: { type: 'string' },
              client_id: { type: 'number' },
              client_name: { type: 'string' },
              description: { type: 'string' },
              managed_by: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description: 'Software updated successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    status: { type: 'string' },
                    url: { type: 'string' },
                    description: { type: 'string' },
                    icon: { type: 'string' },

                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    createdBy: { type: 'string' },
                    updatedBy: { type: 'string' },
                    deletedAt: { type: 'string', format: 'date-time' },
                    deletedBy: { type: 'string' },
                    Client: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                      },
                    },
                    Managers: {
                      type: 'array',
                      items: {
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
                          company_email: {
                            type: 'string',
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
