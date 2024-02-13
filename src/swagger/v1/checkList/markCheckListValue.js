module.exports = {
  patch: {
    tags: ['User CheckList Operations'],
    description:
      'This API endpoint allows to add or update the value of a checklist for a specific user by their user ID.',
    operationId: 'markCheckListValue',
    parameters: [
      {
        name: 'userId',
        in: 'path',
        type: 'string',
        required: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              checklistId: { type: 'string' },
              checklistValue: { type: 'boolean' },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description: `User's Checklist Value has been updated successfully.`,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    checklist_value: { type: 'boolean' },
                    checked_by: {
                      type: 'string',
                      example: 'markeduser@email.com',
                    },
                    checked_at: {
                      type: 'string',
                      example: 'date-time',
                    },

                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                    createdBy: {
                      type: 'string',
                      example: 'techholding@email.com',
                    },
                    updatedBy: {
                      type: 'string',
                      example: 'updatedby@techholdings.com',
                    },
                    user_id: { type: 'string' },
                    checklist_id: { type: 'number' },
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
