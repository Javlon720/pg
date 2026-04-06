import db from '../plugin/db.js'

export async function getBooksService({ page = 1, count = 10, category }) {
  const pageNumber = Number(page) || 1
  const countNumber = Number(count) || 10
  const offset = (pageNumber - 1) * countNumber

  let dataQuery = `
    SELECT *
    FROM books
  `
  const values = []
  const totalValues = []

  if (category) {
    dataQuery += ` WHERE category_id = $1`
    values.push(category)
    totalValues.push(category)
  }

  const limitPlaceholder = values.length + 1
  const offsetPlaceholder = values.length + 2

  dataQuery += ` ORDER BY id ASC LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}`
  values.push(countNumber, offset)

  const booksResult = await db.query(dataQuery, values)

  if (booksResult.rows.length > 0 || pageNumber === 1) {
    return {
      page: pageNumber,
      data: booksResult.rows
    }
  }

  const totalQuery = `
    SELECT COUNT(*) AS total
    FROM books
  `
  const totalResult = await db.query(
    category ? `${totalQuery} WHERE category_id = $1` : totalQuery,
    totalValues
  )

  const total = Number(totalResult.rows[0].total)
  if (total === 0) {
    return {
      page: 1,
      data: []
    }
  }

  const lastPage = Math.max(1, Math.ceil(total / countNumber))
  const lastOffset = (lastPage - 1) * countNumber
  const lastValues = category ? [category, countNumber, lastOffset] : [countNumber, lastOffset]

  const lastPageQuery = `
    SELECT *
    FROM books
  `
  const lastQueryWithCategory = category
    ? `${lastPageQuery} WHERE category_id = $1 ORDER BY id ASC LIMIT $2 OFFSET $3`
    : `${lastPageQuery} ORDER BY id ASC LIMIT $1 OFFSET $2`

  const lastResult = await db.query(lastQueryWithCategory, lastValues)

  return {
    page: lastPage,
    data: lastResult.rows
  }
}

export async function createBookService({ name, price, author_id, category_id }) {
  const authorCheck = await db.query(
    'SELECT id FROM authors WHERE id = $1',
    [author_id]
  )

  if (authorCheck.rows.length === 0) {
    throw new Error('Author not found')
  }

  const categoryCheck = await db.query(
    'SELECT id FROM categories WHERE id = $1',
    [category_id]
  )

  if (categoryCheck.rows.length === 0) {
    throw new Error('Category not found')
  }

  const result = await db.query(
    `
      INSERT INTO books(name, price, author_id, category_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
    [name, price, author_id, category_id]
  )

  return result.rows[0]
}