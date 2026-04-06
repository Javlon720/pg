import {
  getBooksService,
  createBookService
} from '../service/books.service.js'

export async function getBooksController(req, reply) {
  try {
    const { page = 1, count = 10, category } = req.query

    const result = await getBooksService({
      page,
      count,
      category
    })

    return reply.send({
      message: 'Books fetched successfully',
      page: result.page,
      count,
      data: result.data
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Server error',
      error: error.message
    })
  }
}

export async function createBookController(req, reply) {
  try {
    const book = await createBookService(req.body)

    return reply.status(201).send({
      message: 'Book created successfully',
      data: book
    })
  } catch (error) {
    if (
      error.message === 'Author not found' ||
      error.message === 'Category not found'
    ) {
      return reply.status(404).send({ message: error.message })
    }

    return reply.status(500).send({
      message: 'Server error',
      error: error.message
    })
  }
}