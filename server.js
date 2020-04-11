const express = require('express');
const app = express();

const PORT = 3000;

// Middleware so we can read body form request
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Helllo World!'));

// Define routes
app.use('/users', require('./routes/users'));
app.use('/todos', require('./routes/todos'));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
