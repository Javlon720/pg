import './style.css'

const API_BASE = '/api'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="page">
    <header class="topbar">
      <div>
        <p class="eyebrow">Library Management</p>
        <h1>Backend bilan bog'langan frontend</h1>
      </div>
      <button id="refreshAll" class="btn secondary">Refresh</button>
    </header>

    <p id="status" class="status">Ma'lumotlar yuklanmoqda...</p>

    <section class="layout">
      <article class="card">
        <h2>Mualliflar</h2>
        <form id="userForm" class="form-grid">
          <input name="first_name" placeholder="First name" minlength="2" required />
          <input name="last_name" placeholder="Last name" minlength="2" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="username" placeholder="Username" minlength="3" required />
          <button class="btn" type="submit">Muallif qo'shish</button>
        </form>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Email</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody id="usersBody"></tbody>
          </table>
        </div>
      </article>

      <article class="card">
        <h2>Kategoriyalar</h2>
        <form id="categoryForm" class="inline-form">
          <input name="name" placeholder="Kategoriya nomi" minlength="2" required />
          <button class="btn" type="submit">Kategoriya qo'shish</button>
        </form>
        <ul id="categoryList" class="chip-list"></ul>
      </article>

      <article class="card books-card">
        <div class="books-header">
          <h2>Kitoblar</h2>
          <div class="books-controls">
            <label>
              Category:
              <select id="bookCategoryFilter">
                <option value="">Barchasi</option>
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
          <input name="name" placeholder="Kitob nomi" minlength="2" required />
          <input name="price" type="number" min="0" step="1" placeholder="Narx" required />
          <select name="author_id" id="authorSelect" required>
            <option value="">Muallif tanlang</option>
          </select>
          <select name="category_id" id="categorySelect" required>
            <option value="">Kategoriya tanlang</option>
          </select>
          <button class="btn" type="submit">Kitob qo'shish</button>
        </form>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nomi</th>
                <th>Narx</th>
                <th>Muallif ID</th>
                <th>Kategoriya ID</th>
                <th>Yaratilgan</th>
              </tr>
            </thead>
            <tbody id="booksBody"></tbody>
          </table>
        </div>

        <div class="pager">
          <button id="prevPage" class="btn secondary" type="button">Oldingi</button>
          <span id="pageLabel">Sahifa: 1</span>
          <button id="nextPage" class="btn secondary" type="button">Keyingi</button>
        </div>
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
  userForm: document.querySelector('#userForm'),
  categoryForm: document.querySelector('#categoryForm'),
  bookForm: document.querySelector('#bookForm'),
  authorSelect: document.querySelector('#authorSelect'),
  categorySelect: document.querySelector('#categorySelect'),
  bookCategoryFilter: document.querySelector('#bookCategoryFilter'),
  bookCount: document.querySelector('#bookCount'),
  prevPage: document.querySelector('#prevPage'),
  nextPage: document.querySelector('#nextPage'),
  refreshAll: document.querySelector('#refreshAll')
}

const state = {
  users: [],
  categories: [],
  books: [],
  page: 1,
  count: 10,
  categoryFilter: ''
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

function renderUsers() {
  if (state.users.length === 0) {
    ui.usersBody.innerHTML = '<tr><td colspan="5" class="empty">Mualliflar topilmadi</td></tr>'
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
    ui.categoryList.innerHTML = '<li class="empty">Kategoriyalar yo\'q</li>'
  } else {
    ui.categoryList.innerHTML = state.categories
      .map((category) => `<li class="chip">#${category.id} ${category.name}</li>`)
      .join('')
  }

  const options = state.categories
    .map((category) => `<option value="${category.id}">${category.name}</option>`)
    .join('')

  ui.categorySelect.innerHTML = '<option value="">Kategoriya tanlang</option>' + options
  ui.bookCategoryFilter.innerHTML = '<option value="">Barchasi</option>' + options

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

  ui.authorSelect.innerHTML = '<option value="">Muallif tanlang</option>' + options
}

function renderBooks() {
  if (state.books.length === 0) {
    ui.booksBody.innerHTML = '<tr><td colspan="6" class="empty">Kitoblar topilmadi</td></tr>'
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

  ui.pageLabel.textContent = `Sahifa: ${state.page}`
  ui.prevPage.disabled = state.page <= 1
  ui.nextPage.disabled = state.books.length < state.count
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
  const params = new URLSearchParams({
    page: String(state.page),
    count: String(state.count)
  })

  if (state.categoryFilter) {
    params.set('category', String(state.categoryFilter))
  }

  const result = await request(`/books?${params.toString()}`)
  state.page = Number(result.page) || state.page
  state.books = result.data || []
  renderBooks()
}

async function refreshAll() {
  try {
    setStatus('Yuklanmoqda...')
    await Promise.all([loadUsers(), loadCategories(), loadBooks()])
    setStatus('Ma\'lumotlar muvaffaqiyatli yangilandi', 'success')
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
    setStatus('Muallif qo\'shildi', 'success')
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
    setStatus('Kategoriya qo\'shildi', 'success')
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
    setStatus('Kitob qo\'shildi', 'success')
  } catch (error) {
    setStatus(error.message, 'error')
  }
})

ui.bookCategoryFilter.addEventListener('change', async (event) => {
  state.categoryFilter = event.target.value
  state.page = 1
  await refreshAll()
})

ui.bookCount.addEventListener('change', async (event) => {
  state.count = Number(event.target.value)
  state.page = 1
  await loadBooks()
})

ui.prevPage.addEventListener('click', async () => {
  if (state.page <= 1) return
  state.page -= 1
  await loadBooks()
})

ui.nextPage.addEventListener('click', async () => {
  state.page += 1
  await loadBooks()
})

ui.refreshAll.addEventListener('click', async () => {
  await refreshAll()
})

await refreshAll()
