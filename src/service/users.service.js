import db from '../plugin/db.js'

export async function getUsersService({ page = 1, count = 10, category }) {
    const pageNumber = Number(page) || 1
    const countNumber = Number(count) || 10
    const offset = (pageNumber - 1) * countNumber

    let dataQuery = `
    SELECT * 
    FROM users
    `
    const values = []
    const totalValues = []

    if (category) {
        dataQuery += `WHERE category_id = $1`
        values.push(category)
        totalValues.push(category)
    }
    const limitPlaceholder = values.length + 1
    const offsetPlaceholder = values.length + 1

    dataQuery +=`ORDER BY id ASC LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}`
}