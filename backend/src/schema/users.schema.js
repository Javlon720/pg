export const getUsersSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              email: { type: 'string' },
              username: { type: 'string' }
            }
          }
        }
      }
    }
  }
}

export const postUserSchema = {
  body: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'username'],
    properties: {
      first_name: { type: 'string', minLength: 2 },
      last_name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      username: { type: 'string', minLength: 3 }
    },
    additionalProperties: false
  }
}
