-- Create database
CREATE DATABASE bookfolio;

-- Create table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    rating real CHECK (rating >= 1 AND rating <= 5),
    note TEXT,
    status VARCHAR(30),
    start_date DATE,
    completion_date DATE,
    cover_url TEXT
    created_at TIMESTAMP DEFAULT NOW()
);