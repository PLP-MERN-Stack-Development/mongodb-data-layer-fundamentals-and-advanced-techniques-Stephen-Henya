# 📚 MongoDB Data Layer Fundamentals and Advanced Techniques

## Overview
This project is a Week 1 assignment for the MERN Stack course, focusing on MongoDB fundamentals and advanced data layer techniques. You will learn how to set up MongoDB, perform CRUD operations, run advanced queries, use aggregation pipelines, and implement indexing for performance optimization.

## 📦 Project Structure
- `insert_books.js` — Script to insert sample book documents into your MongoDB collection.
- `queries.js` — Contains all MongoDB queries and functions for CRUD, advanced queries, aggregation, and indexing. Run this file to test and demonstrate your solutions.
- `README.md` — This file. Explains setup and usage.
- `examples/` — Example scripts and resources.

## 🛠️ Setup Instructions
1. **Install MongoDB**
	- Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community) **OR** set up a free MongoDB Atlas cluster.
2. **Install Node.js**
	- Download and install Node.js from [nodejs.org](https://nodejs.org/).
3. **Install Dependencies**
	- In your project directory, run:
	  ```powershell
	  npm install
	  ```

## 🚀 How to Run the Scripts

### 1. Insert Sample Data
- Run the `insert_books.js` script to populate your `books` collection:
  ```powershell
  node insert_books.js
  ```

### 2. Run and Test Queries
- Open `queries.js` in your code editor.
- The file contains multiple query function calls, each demonstrating a different MongoDB operation.
- **To test a specific query:**
  - Comment or uncomment the relevant function calls in the `run()` function at the top of `queries.js`.
  - Save the file.
  - Run the script:
	 ```powershell
	 node queries.js
	 ```
- The output will be printed in your terminal for each query.

### 3. Using MongoDB Shell or Compass
- You can also use MongoDB Shell (`mongosh`) or MongoDB Compass to view and verify your data in the `plp_bookstore` database and `books` collection.

## 📄 Example
To find all books by a specific author:
1. Uncomment the line:
	```js
	await findByAuthor(books, "George Orwell");
	```
2. Run:
	```powershell
	node queries.js
	```
3. View the results in your terminal.

## 📝 Notes
- All queries are saved in `queries.js` as required.
- You can modify the scripts to test different data or queries as needed.
- For aggregation and indexing tasks, follow the same process: uncomment the relevant function calls and run the script.

## ✅ Submission Checklist
- [x] `insert_books.js` with your book data
- [x] `queries.js` with all your queries
- [x] `README.md` (this file)
- [x] Screenshot of your MongoDB Compass or Atlas showing your collections and sample data

---

Happy coding! 🚀