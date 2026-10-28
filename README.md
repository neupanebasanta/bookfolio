# Bookfolio 📚

Bookfolio is a personal bookshelf web app where I can keep track of the books I read, rate them, and save my notes about them.

I built this project to practice full-stack web development and get more comfortable working with Express, PostgreSQL, EJS, and external APIs.

## Features

- Add new books to your collection.
- View book details, including ratings, reading status, dates, and notes.
- Edit or delete books whenever you need to.
- Sort books by recently added, rating, or title.
- Fetch book covers using the Open Library API.
- Store book information in a PostgreSQL database.

## Built With

- HTML, CSS, and JavaScript
- Node.js and Express.js
- EJS
- PostgreSQL
- Axios
- Open Library API

## Getting Started

You'll need Node.js and PostgreSQL installed on your machine.

### Installation

1. Clone the repository:

   git clone https://github.com/neupanebasanta/bookfolio
   cd Bookfolio

2. Install the dependencies:

   npm install

3. Create a PostgreSQL database named `bookfolio` and set up the `books` table using the schema in queries.sql.

4. Create a `.env` file in the root directory:

   PORT=3000

   DB_USER=postgres_username
   DB_HOST=localhost
   DB_NAME=bookfolio
   DB_PASSWORD=postgres_password
   DB_PORT=5432

5. Start the server:

   node index.js

6. Open (http://localhost:3000) in your browser.


## Acknowledgements

Book cover data and images are provided through [Open Library](https://openlibrary.org/).

---

Built as a personal project while learning full-stack web development.

---

This project will keep growing with new features.