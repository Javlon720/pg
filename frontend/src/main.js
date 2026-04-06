import './style.css'

const API_BASE = '/api'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="page">
    <header class="topbar">
      <div>
        <p class="eyebrow">Library Management</p>
        <h1>Frontend connected to the backend</h1>
      </div>
      <button id="refreshAll" class="btn secondary">Refresh</button>
    </header>

    <p id="status" class="status">Loading data...</p>

    <section class="layout">
      <article class="card">
        <h2>Authors</h2>
        <form id="userForm" class="form-grid">
          <input name="first_name" placeholder="First name" minlength="2" required />
          <input name="last_name" placeholder="Last name" minlength="2" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="username" placeholder="Username" minlength="3" required />
          <button class="btn" type="submit">Add author</button>
        </form>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody id="usersBody"></tbody>
          </table>
        </div>
      </article>

      <article class="card">
        <h2>Categories</h2>
        <form id="categoryForm" class="inline-form">
          <input name="name" placeholder="Category name" minlength="2" required />
          <button class="btn" type="submit">Add category</button>
        </form>
        <ul id="categoryList" class="chip-list"></ul>
      </article>

      <article class="card books-card">
        <div class="books-header">
          <h2>Books</h2>
          <div class="books-controls">
            <label>
              Category:
              <select id="bookCategoryFilter">
                <option value="">All</option>
              </select>
            </label>
            <label>
              Count:
              <select id="bookCount">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
        </div>

        <form id="bookForm" class="form-grid">
          <input name="name" placeholder="Book title" minlength="2" required />
          <input name="price" type="number" min="0" step="1" placeholder="Price" required />
          <select name="author_id" id="authorSelect" required>
            <option value="">Select an author</option>
          </select>
          <select name="category_id" id="categorySelect" required>
            <option value="">Select a category</option>
          </select>
          <button class="btn" type="submit">Add book</button>
        </form>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Author ID</th>
                <th>Category ID</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody id="booksBody"></tbody>
          </table>
        </div>

        <div class="load-more-bar">
          <span id="pageLabel">Showing: 0 / 0</span>
          <button id="loadMore" class="btn secondary" type="button">Load more</button>
        </div>
        <p class="query-line">GET <code id="queryText">/books?page=1&count=10</code></p>
      </article>
    </section>
  </div>
`

const ui = {
  status: document.querySelector('#status'),
  usersBody: document.querySelector('#usersBody'),
  categoryList: document.querySelector('#categoryList'),
  booksBody: document.querySelector('#booksBody'),
  pageLabel: document.querySelector('#pageLabel'),
  queryText: document.querySelector('#queryText'),
  userForm: document.querySelector('#userForm'),
  categoryForm: document.querySelector('#categoryForm'),
  bookForm: document.querySelector('#bookForm'),
  authorSelect: document.querySelector('#authorSelect'),
  categorySelect: document.querySelector('#categorySelect'),
  bookCategoryFilter: document.querySelector('#bookCategoryFilter'),
  bookCount: document.querySelector('#bookCount'),
  loadMore: document.querySelector('#loadMore'),
  refreshAll: document.querySelector('#refreshAll')
}

const state = {
  users: [],
  categories: [],
  books: [],
  page: 1,
  count: 10,
  categoryFilter: '',
  total: 0,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`)
  }

  return payload
}

function setStatus(message, type = 'info') {
  ui.status.textContent = message
  ui.status.dataset.type = type
}

function formatDate(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  return date.toLocaleString('uz-UZ')
}

function initializeStateFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const page = Number(params.get('page'))
  const count = Number(params.get('count'))
  const category = params.get('category')

  if (page > 0) state.page = page
  if (count > 0) state.count = count
  if (category) state.categoryFilter = category
}

function renderUsers() {
  if (state.users.length === 0) {
    ui.usersBody.innerHTML = '<tr><td colspan="5" class="empty">No authors found</td></tr>'
    return
  }

  ui.usersBody.innerHTML = state.users
    .map(
      (user) => `
      <tr>
        <td>${user.id}</td>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.username}</td>
      </tr>
    `
    )
    .join('')
}

function renderCategories() {
  if (state.categories.length === 0) {
    ui.categoryList.innerHTML = '<li class="empty">No categories yet</li>'
  } else {
    ui.categoryList.innerHTML = state.categories
      .map((category) => `<li class="chip">#${category.id} ${category.name}</li>`)
      .join('')
  }

  const options = state.categories
    .map((category) => `<option value="${category.id}">${category.name}</option>`)
    .join('')

  ui.categorySelect.innerHTML = '<option value="">Select a category</option>' + options
  ui.bookCategoryFilter.innerHTML = '<option value="">All</option>' + options

  if (state.categoryFilter) {
    ui.bookCategoryFilter.value = String(state.categoryFilter)
  }
}

function renderAuthorsForBook() {
  const options = state.users
    .map(
      (user) =>
        `<option value="${user.id}">${user.first_name} ${user.last_name} (@${user.username})</option>`
    )
    .join('')

  ui.authorSelect.innerHTML = '<option value="">Select an author</option>' + options
}

function renderBooks() {
  if (state.books.length === 0) {
    ui.booksBody.innerHTML = '<tr><td colspan="6" class="empty">No books found</td></tr>'
  } else {
    ui.booksBody.innerHTML = state.books
      .map(
        (book) => `
          <tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${Number(book.price).toLocaleString('uz-UZ')}</td>
            <td>${book.author_id}</td>
            <td>${book.category_id}</td>
            <td>${formatDate(book.created_at)}</td>
          </tr>
        `
      )
      .join('')
  }

  ui.pageLabel.textContent = `Showing: ${state.books.length} / ${state.total}`
  ui.loadMore.disabled = !state.hasNextPage
  ui.loadMore.hidden = state.total === 0 || !state.hasNextPage
  syncQueryInUrl()
}

function buildBooksParams(page) {
  const params = new URLSearchParams({
    page: String(page),
    count: String(state.count)
  })

  if (state.categoryFilter) {
    params.set('category', String(state.categoryFilter))
  }

  return params
}

async function fetchBooksPage(page) {
  const params = buildBooksParams(page)
  return request(`/books?${params.toString()}`)
}

function syncQueryInUrl() {
  const params = buildBooksParams(state.page)
  const queryString = params.toString()
  const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname
  window.history.replaceState({}, '', nextUrl)
  ui.queryText.textContent = `/books?${queryString}`
}

async function loadUsers() {
  const result = await request('/users')
  state.users = result.data || []
  renderUsers()
  renderAuthorsForBook()
}

async function loadCategories() {
  const result = await request('/categories')
  state.categories = result.data || []
  renderCategories()
}

async function loadBooks() {
  const result = await fetchBooksPage(state.page)

  state.page = Number(result.page) || state.page
  state.count = Number(result.count) || state.count
  state.total = Number(result.total) || 0
  state.totalPages = Number(result.total_pages) || 1
  state.hasPrevPage = Boolean(result.has_prev_page)
  state.hasNextPage = Boolean(result.has_next_page)
  state.books = result.data || []
  renderBooks()
}

async function loadMoreBooks() {
  if (!state.hasNextPage) return

  const nextPage = state.page + 1
  const result = await fetchBooksPage(nextPage)

  state.page = Number(result.page) || nextPage
  state.count = Number(result.count) || state.count
  state.total = Number(result.total) || 0
  state.totalPages = Number(result.total_pages) || 1
  state.hasPrevPage = Boolean(result.has_prev_page)
  state.hasNextPage = Boolean(result.has_next_page)
  state.books = [...state.books, ...(result.data || [])]
  renderBooks()
}

async function refreshAll() {
  try {
    setStatus('Loading...')
    await Promise.all([loadUsers(), loadCategories(), loadBooks()])
    setStatus('Data refreshed successfully', 'success')
  } catch (error) {
    setStatus(error.message, 'error')
  }
}

ui.userForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const formData = new FormData(ui.userForm)
  const payload = Object.fromEntries(formData.entries())

  try {
    await request('/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    ui.userForm.reset()
    await loadUsers()
    setStatus('Author added', 'success')
  } catch (error) {
    setStatus(error.message, 'error')
  }
})

ui.categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const formData = new FormData(ui.categoryForm)
  const payload = Object.fromEntries(formData.entries())

  try {
    await request('/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    ui.categoryForm.reset()
    await loadCategories()
    state.page = 1
    await loadBooks()
    setStatus('Category added', 'success')
  } catch (error) {
    setStatus(error.message, 'error')
  }
})

ui.bookForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const formData = new FormData(ui.bookForm)
  const rawPayload = Object.fromEntries(formData.entries())
  const payload = {
    name: rawPayload.name,
    price: Number(rawPayload.price),
    author_id: Number(rawPayload.author_id),
    category_id: Number(rawPayload.category_id)
  }

  try {
    await request('/books', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    ui.bookForm.reset()
    await loadBooks()
    setStatus('Book added', 'success')
  } catch (error) {
    setStatus(error.message, 'error')
  }
})

ui.bookCategoryFilter.addEventListener('change', async (event) => {
  state.categoryFilter = event.target.value
  state.page = 1
  await loadBooks()
})

ui.bookCount.addEventListener('change', async (event) => {
  state.count = Number(event.target.value)
  state.page = 1
  await loadBooks()
})

ui.loadMore.addEventListener('click', async () => {
  await loadMoreBooks()
})

ui.refreshAll.addEventListener('click', async () => {
  await refreshAll()
})

initializeStateFromUrl()
ui.bookCount.value = String(state.count)

await refreshAll()
