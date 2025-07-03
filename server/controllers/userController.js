const User = require('../models/userModel');
const mongoose = require('mongoose');
// get all Users
const getUsers = async (req, res) => {
  try {
    const Users = await User.find({});
    res.status(200).json(Users);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a single User
const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }
    try {
        const User = await User.findById(id);
        if (!User) {
        return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(User);
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// create a new User
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const User = await User.create({ username, password, role });
    res.status(200).json(User);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    const User = await User.findOneAndDelete({ _id: id });
    if (!User) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    const User = await User.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!User) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(User);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}