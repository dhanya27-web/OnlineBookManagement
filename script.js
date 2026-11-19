
const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");

// Display all books
async function loadBooks() {
    try {
        const response = await fetch("/books");

        if (!response.ok) {
            throw new Error("Unable to load books");
        }

        const books = await response.json();

        bookList.innerHTML = "";

        books.forEach(book => {
            bookList.innerHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>₹${book.price}</td>

                    <td>
                        <button onclick="editBook(${book.id})">
                            Edit
                        </button>
                    </td>

                    <td>
                        <button class="delete-btn"
                            onclick="deleteBook(${book.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        bookList.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load books. Please try again.
                </td>
            </tr>
        `;
    }
}

// Add a new book
bookForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = Number(document.getElementById("price").value);

    if (!title || !author || !Number.isFinite(price) || price <= 0) {
        alert("Please enter valid book details.");
        return;
    }

    try {
        const response = await fetch("/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, author, price })
        });

        const result = await response.json();

        alert(result.message);

        if (response.ok) {
            bookForm.reset();
            loadBooks();
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    }
});

// Edit a book
async function editBook(id) {
    const title = prompt("Enter new book title:");

    if (title === null || !title.trim()) return;

    const author = prompt("Enter new author name:");

    if (author === null || !author.trim()) return;

    const priceInput = prompt("Enter new price:");

    if (priceInput === null || priceInput.trim() === "") return;

    const price = Number(priceInput);

    if (!Number.isFinite(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    try {
        const response = await fetch(`/books/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, author, price })
        });

        const result = await response.json();

        alert(result.message);

        if (response.ok) {
            loadBooks();
        }

    } catch (error) {
        alert("Unable to update book. Please try again.");
    }
}

// Delete a book
async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
        const response = await fetch(`/books/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        alert(result.message);

        if (response.ok) {
            loadBooks();
        }

    } catch (error) {
        alert("Unable to delete book. Please try again.");
    }
}

// Load books when page opens
loadBooks();
