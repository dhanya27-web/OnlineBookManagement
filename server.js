
const express = require('express');
const path = require('path');

const app = express();

// Store book details
let books = [
    {
        id: 1,
        title: "Python Basics",
        author: "John",
        price: 350
    },
    {
        id: 2,
        title: "Java Programming",
        author: "David",
        price: 450
    }
];

// Middleware
app.use(express.json());

// Connect frontend files
app.use(express.static(path.join(__dirname, 'public')));

// GET API - Retrieve all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET API - Retrieve book by ID
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// POST API - Add a new book
app.post('/books', (req, res) => {
    const { title, author, price } = req.body;

    if (!title || !author || price === undefined ||
        isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please provide valid book details"
        });
    }

    const newBook = {
        id: books.length > 0
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: title,
        author: author,
        price: Number(price)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// PUT API - Update book details
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (!title || !author || price === undefined ||
        isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please provide valid book details"
        });
    }

    book.title = title;
    book.author = author;
    book.price = Number(price);

    res.json({
        message: "Book updated successfully",
        book: book
    });
});

// DELETE API - Delete a book
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(bookIndex, 1);

    res.json({
        message: "Book deleted successfully"
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
