const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// User login
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json('Incorrect data');
  }

  let user = await db('users').where('username', username);
  if (user.length == 0) {
    return res.status(400).json('Wrong username');
  }
  const isValid = bcrypt.compareSync(password, user[0].pwd_hash);
  if (isValid) {
    // Get todos from db
    const todos = await db('todos').where('user_id', user[0].user_id);
    res.json({ username: user[0].username, todos: todos });
  } else {
    res.status(400).json('Wrong password');
  }
});

module.exports = router;
