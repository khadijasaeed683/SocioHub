const User = require('../models/userModel');
const Society = require('../models/societyModel');
const Event = require('../models/eventModel');
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
const getUserSocieties = async (req, res) => {
  console.log("Fetching user societies...");
  try {
    const user = req.user; 
    console.log("User trying to get societies:", user, user._id);

    const registeredSocieties = [];
    const joinedSocieties = [];

    // Map over society IDs to create an array of promises
    const societyPromises = user.societies.map(societyId =>
      Society.findById(societyId)
    );

    // Wait for all findById calls to complete
    const societies = await Promise.all(societyPromises);
    console.log(societies)
    societies.forEach(society => {
      if (!society) return; // Skip if society not found
      if (society.createdBy.toString() === user._id.toString()) {
        registeredSocieties.push(society);
      } else {
        joinedSocieties.push(society);
      }
    });

    console.log("Registered Societies:", registeredSocieties);
    console.log("Joined Societies:", joinedSocieties);

    res.status(200).json({
      registeredSocieties,
      joinedSocieties
    });

  } catch (error) {
    console.error("Error fetching user societies:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserEvents = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    const user = await User.findById(id).populate({
      path: 'registeredEvents',
      populate: {
        path: 'societyId', // populate societyId field inside each event
        model: 'Society'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("User events with societies:", user.registeredEvents);
    res.status(200).json(user.registeredEvents);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const unregisterEvent = async (req, res) => {
  const { userId, eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Remove eventId from user's registeredEvents
    user.registeredEvents = user.registeredEvents.filter(
      (id) => id.toString() !== eventId
    );
    await user.save();

    // OPTIONAL: Remove userId from event’s participants
    await Event.findByIdAndUpdate(eventId, {
      $pull: { participants: userId }
    });

    res.status(200).json({ message: 'Successfully unregistered from event.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getUserSocieties,
    getUserEvents,
    unregisterEvent
}