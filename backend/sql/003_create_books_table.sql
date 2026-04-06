CREATE TABLE books(
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    price INT CHECK(price >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    author_id INT REFERENCES authors(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE
);