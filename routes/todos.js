const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/:username', async (req, res) => {
  const username = req.params.username;
  const { todo_message, finished } = req.body;

  try {
    let user_id = await db('users')
      .where('username', username)
      .select('user_id');
    user_id = user_id[0].user_id;

    const todo = {
      user_id,
      todo_message,
      finished,
    };

    let result = await db('todos').returning('todo_id').insert(todo);

    result = result[0];
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

router.put('/:todo_id', async (req, res) => {
  const todo_id = req.params.todo_id;
  const finished = req.body.finished;

  try {
    const result = await db('todos')
      .returning('todo_id')
      .where('todo_id', '=', todo_id)
      .update({ finished: finished });
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

router.delete('/:todo_id', async (req, res) => {
  const todo_id = req.params.todo_id;

  try {
    await db('todos').where('todo_id', '=', todo_id).del();
    res.json('deleted');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
