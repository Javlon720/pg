import {
  getCategoriesService,
  createCategoryService
} from '../service/categories.service.js'

export async function getCategoriesController(req, reply) {
  try {
    const categories = await getCategoriesService()

    return reply.send({
      message: 'Categories fetched successfully',
      data: categories
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Server error',
      error: error.message
    })
  }
}

export async function createCategoryController(req, reply) {
  try {
    const category = await createCategoryService(req.body)

    return reply.status(201).send({
      message: 'Category created successfully',
      data: category
    })
  } catch (error) {
    if (error.message === 'Category already exists') {
      return reply.status(409).send({ message: error.message })
    }

    return reply.status(500).send({
      message: 'Server error',
      error: error.message
    })
  }
}
