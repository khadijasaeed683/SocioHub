const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser
}= require('../controllers/userController');

// listen for requests
router.get('/', getUsers);

router.post('/', createUser);

router.get('/:id', getUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);
  

module.exports = router;
