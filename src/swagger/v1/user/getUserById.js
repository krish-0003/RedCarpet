module.exports = {
  get: {
    tags: ['User Operations'],
    description:
      'This API endpoint retrieves a specific users information by their user ID.',
    oprationId: 'getUserById',
    parameters: [
      {
        name: 'userId',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'User information',
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
                    employee_id: {
                      type: 'string',
                    },
                    first_name: {
                      type: 'string',
                    },
                    last_name: {
                      type: 'string',
                    },
                    company_email: {
                      type: 'string',
                      format: 'email',
                    },
                    personal_email: {
                      type: 'string',
                      format: 'email',
                    },
                    country_code: {
                      type: 'string',
                    },
                    phone_number: {
                      type: 'string',
                    },
                    address: {
                      type: 'string',
                    },
                    city: {
                      type: 'string',
                    },
                    state: {
                      type: 'string',
                    },
                    zipcode: {
                      type: 'string',
                    },
                    branch_id: {
                      type: 'integer',
                    },
                    join_date: {
                      type: 'string',
                      format: 'date-time',
                    },
                    end_date: {
                      type: 'string',
                      format: 'date-time',
                    },
                    capacity: {
                      type: 'integer',
                    },
                    role_id: {
                      type: 'integer',
                    },
                    employment_type: {
                      type: 'string',
                    },
                    job_title: {
                      type: 'string',
                    },
                    status: {
                      type: 'string',
                    },
                    note: {
                      type: 'string',
                    },
                    Branch: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                      },
                    },
                    Department: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                      },
                    },
                    Agency: {
                      type: 'object',
                      properties: {
                        person_name: {
                          type: 'string',
                        },
                        email: {
                          type: 'string',
                        },
                      },
                    },
                    manager: {
                      type: 'object',
                      properties: {
                        first_name: {
                          type: 'string',
                        },
                        last_name: {
                          type: 'string',
                        },
                      },
                    },
                    UserRole: {
                      type: 'object',
                      properties: {
                        role: {
                          type: 'string',
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
                message: {
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
