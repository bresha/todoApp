const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const PORT = 3000;

// Middleware so we can read body form request
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json('Hello World!'));

// Define routes

// Register a user
app.use('/register', require('./routes/register'));

// Login a user
app.use('/login', require('./routes/login'));

// Create, delete and update todos
app.use('/todos', require('./routes/todos'));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
