import {
  getUsersService,
  createUserService
} from '../service/users.service.js'

export async function getUsersController(req, reply) {
  try {
    const users = await getUsersService()

    return reply.send({
      message: 'Users fetched successfully',
      data: users
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Server error',
      error: error.message
    })
  }
}

export async function createUserController(req, reply) {
  try {
    const user = await createUserService(req.body)

    return reply.status(201).send({
      message: 'User created successfully',
      data: user
    })
  } catch (error) {
    if (error.message === 'Email already exists' || error.message === 'Username already exists') {
      return reply.status(409).send({ message: error.message })
    }

    return reply.status(500).send({
      message: 'Server error',
      error: error.message
    })
  }
}
