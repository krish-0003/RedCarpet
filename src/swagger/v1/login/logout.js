module.exports = {
  delete: {
    tags: ['Authentication Operation'],
    description: 'logout from system',
    operationId: 'logout',
    responses: {
      200: {
        description: 'Logged out successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                error: { type: 'boolean', example: false },
              },
            },
          },
        },
      },
    },
  },
};
