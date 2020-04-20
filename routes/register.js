const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Register a user
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json('Incorrect data');
  }

  let user = await db('users').where('username', username);
  if (user.length > 0) {
    return res.status(400).json('User already exists');
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const pwd_hash = bcrypt.hashSync(password, salt);
    const user = {
      username,
      pwd_hash,
    };

    const result = await db('users').returning('username').insert(user);

    res.json({ username: result[0], todos: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
