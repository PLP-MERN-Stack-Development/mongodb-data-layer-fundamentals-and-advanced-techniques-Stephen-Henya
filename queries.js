const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("plp_bookstore");
    const books = db.collection("books");

    console.log("\nConnected to plp_bookstore database ✅");

    // You can comment/uncomment the query calls below to test them:
    
    // === Task 2: Basic CRUD Operations ===
    await findAllBooks(books);
    await findAfterYear(books, 1959);
    await findByAuthor(books, "George Orwell");
    await updateBookPrice(books, "Wuthering Heights", 7.99);
    await deleteBookByTitle(books, "Moby Dick");

    // === Task 3: Advanced Queries ===
    await findInStockAfter2010(books);
    await projectTitleAuthorPrice(books);
    await sortByPrice(books, "asc");
    await paginateBooks(books, 1, 5);

    // === Task 4: Aggregation Queries ===
    await averagePriceByGenre(books);
    await authorWithMostBooks(books);
    await booksByDecade(books);

    // === Task 5: Indexing Queries ===
    await createTitleIndex(books);
    await createCompoundIndex(books);
    await analyzeIndexPerformance(books);


  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    await client.close();
    console.log("\nMongoDB connection closed 💤");
  }
}

run().catch(console.error);

// =========================
// Task 2: Basic CRUD Operations; Query Functions
// =========================

// a) Finding all books 
async function findAllBooks(books) {
  const allBooks = await books.find({}).toArray();
  console.log("\nAll Books:");
  console.log(allBooks);
}

// b) Finding books published after a certain year
async function findAfterYear(books, year) {
  const result = await books.find({ published_year: { $gt: year } }).toArray();
  console.log(`\nBooks published after ${year}:`);
  console.log(result);
}

// c) Finding books by a specific author
async function findByAuthor(books, authorName) {
  const result = await books.find({ author: authorName }).toArray();
  console.log(`\nBooks by ${authorName}:`);
  console.log(result);
}

// d) Updating the price of a specific book
async function updateBookPrice(books, title, newPrice) {
  const result = await books.updateOne(
    { title },
    { $set: { price: newPrice } }
  );
  console.log(`\nUpdated price for "${title}" →`, result.modifiedCount ? "Success" : "No match found");
}

// e) Deleting a book by its title
async function deleteBookByTitle(books, title) {
  const result = await books.deleteOne({ title });
  console.log(`\nDeleted "${title}" →`, result.deletedCount ? "Success" : "No match found");
}

// ==================================
// Task 3: Advanced Queries Functions
// ==================================

// a) Find books that are both in stock and published after 2010
async function findInStockAfter2010(books) {
  const results = await books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
  }).toArray();

  console.log("\n📘 Books in stock and published after 2010:");
  console.log(results);
}

// b) Using projection to return only the title, author and price fields
async function projectTitleAuthorPrice(books) {
  const results = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();

  console.log("\n🎯 Books (Title, Author, Price only):");
  console.log(results);
}

// c) Implementing sorting to display books by price(both ascending and descending)
async function sortByPrice(books, order = "asc") {
  const sortOrder = order === "asc" ? 1 : -1;
  const results = await books.find({}).sort({ price: sortOrder }).toArray();

  console.log(`\n💰 Books sorted by price (${order}):`);
  console.log(results);
}

// d) Using limit and skip methods to implement pagination(5 books per page)
async function paginateBooks(books, page = 1, pageSize = 5) {
  const skip = (page - 1) * pageSize;

  const results = await books.find({})
    .skip(skip)
    .limit(pageSize)
    .toArray();

  console.log(`\n📄 Page ${page} (showing ${pageSize} books):`);
  console.log(results);
}


// ======================================
// Task 4: Aggregation Pipeline Functions
// ======================================

// a) Calculating average price of books by genre
async function averagePriceByGenre(books) {
  const result = await books.aggregate([
    {
      $group: {
        _id: "$genre",
        averagePrice: { $avg: "$price" }
      }
    },
    { $sort: { averagePrice: -1 } } // sort, optional but nice
  ]).toArray();

  console.log("\nAverage Price by Genre:");
  console.table(result);
}
// b) Finding author with the most books in the collection
async function authorWithMostBooks(books) {
  const result = await books.aggregate([
    {
      $group: {
        _id: "$author",
        totalBooks: { $sum: 1 }
      }
    },
    { $sort: { totalBooks: -1 } },
    { $limit: 1 }
  ]).toArray();

  console.log("\nAuthor with the Most Books:");
  console.table(result);
}
// c) Implementing a pipeline that groups books by publication decade and counts them
async function booksByDecade(books) {
  const result = await books.aggregate([
    {
      $group: {
        _id: {
          $subtract: [
            "$published_year",
            { $mod: ["$published_year", 10] }
          ]
        },
        totalBooks: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();

  console.log("\nBooks Grouped by Publication Decade:");
  console.table(result);
}

// ==========================
// Task 5: Indexing Functions
// ==========================

// a) Creating an index on the `title` field for faster searches
async function createTitleIndex(books) {
  const result = await books.createIndex({ title: 1 });
  console.log("\nCreated Index:", result);
}
// b) Creating a compound index on `author` and `published_year`
async function createCompoundIndex(books) {
  const result = await books.createIndex({ author: 1, published_year: -1 });
  console.log("Created Compound Index:", result);
}
// c) Using the `explain()` method to demonstrate the performance improvement with your indexes
async function analyzeIndexPerformance(books) {
  const query = { title: "1984" };

  // Dropping any existing indexes to start clean
  await books.dropIndexes();

  // Checking performance BEFORE index
  const before = await books.find(query).explain("executionStats");
  console.log("\nBefore Index: Total Docs Examined =", before.executionStats.totalDocsExamined);
  console.log("Before Index: Execution Time =", before.executionStats.executionTimeMillis, "ms");

  // Recreating the index
  await books.createIndex({ title: 1 });

  // Checking performance AFTER index
  const after = await books.find(query).explain("executionStats");
  console.log("After Index: Total Docs Examined =", after.executionStats.totalDocsExamined);
  console.log("After Index: Execution Time =", after.executionStats.executionTimeMillis, "ms");

  // Optional: checking if the index was used
  console.log("Winning Plan:", after.queryPlanner.winningPlan.stage);
}
