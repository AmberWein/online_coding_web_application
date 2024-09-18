require('dotenv').config()

const mongoose = require('mongoose');
const CodeBlock = require('./models/codeblocks');  // Import the CodeBlock model

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Seed data
const seedCodeBlocks = async () => {
  const codeBlocks = [
    {
      title: "Async Case",
      template: "function asyncExample() {\n // write your async function here\n}",
      solution: "async function asyncExample() {\n return 'done';\n}"
    },
    {
      title: "Array Sort",
      template: "function sortArray(arr) {\n // write your sorting code here\n}",
      solution: "function sortArray(arr) {\n return arr.sort();\n}"
    },
    {
      title: "String Reversal",
      template: "function reverseString(str) {\n // write your string reversal code here\n}",
      solution: "function reverseString(str) {\n return str.split('').reverse().join('');\n}"
    },
    {
      title: "FizzBuzz",
      template: "function fizzBuzz(n) {\n // implement FizzBuzz here\n}",
      solution: "function fizzBuzz(n) {\n for (let i = 1; i <= n; i++) {\n if (i % 3 === 0 && i % 5 === 0) console.log('FizzBuzz');\n else if (i % 3 === 0) console.log('Fizz');\n else if (i % 5 === 0) console.log('Buzz');\n else console.log(i);\n }\n}"
    }
  ];

  // Insert code blocks into the database
  await CodeBlock.insertMany(codeBlocks);
  console.log('Database seeded with code blocks');
  mongoose.connection.close();
};

// Call the seeding function
seedCodeBlocks();