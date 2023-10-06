const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

const public_users = express.Router();
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBookList();
    return res.status(200).send(JSON.stringify(bookList, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from request parameters

  // Check if the book with the given ISBN exists in the booksData
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author; // Retrieve the author from request parameters

  try {
    const booksByAuthor = await getBooksByAuthor(author);
    if (Object.keys(booksByAuthor).length > 0) {
      return res.json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found for the author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});



// Get all books based on title
// Get book details based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title; // Retrieve the title from request parameters

  try {
    const booksByTitle = await getBooksByTitle(title);
    if (Object.keys(booksByTitle).length > 0) {
      return res.json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with the title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});


// Get book review
// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from request parameters

  try {
    const bookDetails = await getBookDetails(isbn);
    if (bookDetails) {
      return res.json(bookDetails);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});


module.exports.general = public_users;