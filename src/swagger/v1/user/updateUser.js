module.exports = {
  patch: {
    tags: ['User Operations'],
    description:
      'This API endpoint allows to update a specific users information by their user ID',
    oprationId: 'updateUser',
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
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              employee_id: { type: 'string' },
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              company_email: { type: 'string', format: 'email' },
              personal_email: { type: 'string', format: 'email' },
              country_code: { type: 'string' },
              phone_number: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zipcode: { type: 'string' },
              branch_id: { type: 'integer' },
              capacity: { type: 'integer' },
              role_id: { type: 'integer' },
              employment_type: { type: 'string' },
              job_title: { type: 'string' },
              status: { type: 'string' },
              note: { type: 'string' },
              agency_email: { type: 'string', format: 'email' },
              agency_name: { type: 'string' },
              department_id: { type: 'integer' },
              manager_id: { type: 'integer' },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User added successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    Branch: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        name: {
                          type: 'string',
                        },
                      },
                    },
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
                    },
                    country_code: {
                      type: 'string',
                    },
                    phone_number: {
                      type: 'string',
                    },
                    personal_email: {
                      type: 'string',
                    },
                    branch_id: {
                      type: 'number',
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
                    status: {
                      type: 'string',
                    },
                    zipcode: {
                      type: 'string',
                    },
                    job_title: {
                      type: 'string',
                    },
                    employment_type: {
                      type: 'string',
                    },
                    capacity: {
                      type: 'number',
                    },
                    role_id: {
                      type: 'number',
                    },
                    join_date: {
                      type: 'string',
                    },
                    department_id: {
                      type: 'number',
                    },
                    manager_id: {
                      type: 'number',
                    },

                    createdAt: {
                      type: 'string',
                    },
                    updatedAt: {
                      type: 'string',
                    },
                    updatedBy: {
                      type: 'string',
                    },
                    createdBy: {
                      type: 'string',
                    },
                  },
                },
                code: {
                  type: 'number',
                },
                message: {
                  type: 'string',
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
