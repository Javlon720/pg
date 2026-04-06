import db from '../plugin/db.js'

export async function getCategoriesService() {
  const result = await db.query('SELECT id, name FROM categories ORDER BY id ASC')
  return result.rows
}

export async function createCategoryService({ name }) {
  try {
    const result = await db.query(
      `
        INSERT INTO categories(name)
        VALUES($1)
        RETURNING *
      `,
      [name]
    )

    return result.rows[0]
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Category already exists')
    }
    throw error
  }
}
