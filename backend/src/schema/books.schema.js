export const getBooksSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      count: { type: 'integer', minimum: 1, default: 10 },
      category: { type: 'integer', minimum: 1 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        page: { type: 'integer' },
        count: { type: 'integer' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              price: { type: 'integer' },
              created_at: { type: 'string' },
              author_id: { type: 'integer' },
              category_id: { type: 'integer' }
            }
          }
        }
      }
    }
  }
}

export const postBookSchema = {
  body: {
    type: 'object',
    required: ['name', 'price', 'author_id', 'category_id'],
    properties: {
      name: { type: 'string', minLength: 2 },
      price: { type: 'integer', minimum: 0 },
      author_id: { type: 'integer', minimum: 1 },
      category_id: { type: 'integer', minimum: 1 }
    },
    additionalProperties: false
  }
}