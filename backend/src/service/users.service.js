import db from '../plugin/db.js'

export async function getUsersService() {
  const result = await db.query(
    'SELECT id, first_name, last_name, email, username FROM authors ORDER BY id ASC'
  )

  return result.rows
}

export async function createUserService({ first_name, last_name, email, username }) {
  try {
    const result = await db.query(
      `
        INSERT INTO authors(first_name, last_name, email, username)
        VALUES($1, $2, $3, $4)
        RETURNING *
      `,
      [first_name, last_name, email, username]
    )

    return result.rows[0]
  } catch (error) {
    if (error.code === '23505') {
      if (error.constraint?.includes('email')) {
        throw new Error('Email already exists')
      }
      if (error.constraint?.includes('username')) {
        throw new Error('Username already exists')
      }
    }
    throw error
  }
}
