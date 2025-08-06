const User = require('../models/userModel');
const Society = require('../models/societyModel');
const Event = require('../models/eventModel');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const extractPublicId =  require('../utils/extractPublicId');
// get all Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  try {
    const { id } = req.user;
    console.log("user id to delete: ", id)
    // 1. Find user
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    // 2. Delete user's profile picture from Cloudinary
    if (user.pfp) {
      const pfpId = extractPublicId(user.pfp);
      await cloudinary.uploader.destroy(pfpId);
    }

    // 3. Remove user from societies' members and pendingRequests
    await Society.updateMany(
      { members: id },
      { $pull: { members: id } }
    );
    await Society.updateMany(
      {},
      { $pull: { pendingRequests: { userId: id } } }
    );

    // 4. Delete societies created by the user
    const societies = await Society.find({ createdBy: id });

    for (const society of societies) {
      // a. Delete society logo & cover image
      const logoId = extractPublicId(society.logo);
      const coverId = extractPublicId(society.coverImage);

      if (logoId) await cloudinary.uploader.destroy(logoId);
      if (coverId) await cloudinary.uploader.destroy(coverId);

      // b. Delete all events of the society
      const events = await Event.find({ societyId: society._id });
      for (const event of events) {
        const posterId = extractPublicId(event.poster);
        if (posterId) await cloudinary.uploader.destroy(posterId);

        await Event.findByIdAndDelete(event._id);
      }

      // c. Delete the society
      await Society.findByIdAndDelete(society._id);
    }

    // 5. Finally, delete user
    await User.findByIdAndDelete(id);

    console.log(`✅ User and related data deleted for id: ${id}`);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user and cleanup:', err.message);
    res.status(200).json( { success: false, error: err.message });
  }
};

// update a User
const updateUser = async (req, res) => {
  const { id } = req.user;
  const { username, email, bio } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    const avatarFile = req.files?.avatar?.[0];
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    // Upload avatar to Cloudinary if provided
    if (avatarFile) {
      const uploadedAvatar = await cloudinary.uploader.upload(avatarFile.path, {
        resource_type: 'image',
        folder: 'avatars'
      });
      user.pfp = uploadedAvatar.secure_url;
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

const getUserSocieties = async (req, res) => {
  console.log("Fetching user societies...");
  try {
    const user = req.user;

    const registeredSocieties = [];
    const joinedSocieties = [];

    const societyPromises = user.societies.map(societyId =>
      Society.findOne({ _id: societyId })
    );

    const societies = (await Promise.all(societyPromises)).filter(Boolean);

    societies.forEach(society => {
      if (society.createdBy.toString() === user._id.toString()) {
        registeredSocieties.push(society);
      } else {
        joinedSocieties.push(society);
      }
    });

    // console.log("Registered Societies:", registeredSocieties);
    // console.log("Joined Societies:", joinedSocieties);

    res.status(200).json({
      registeredSocieties: registeredSocieties,
      joinedSocieties: joinedSocieties
    });

  } catch (error) {
    console.error("Error fetching user societies:", error);
    return res.status(500).json({ error: error.message });
  }
};


const getUserEvents = async (req, res) => {
  const id = req.user.id;
  console.log("Fetching events for user ID:", id);
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
  try {
    const eventId = req.params.eventId;
    const user = req.user;

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const participantIndex = event.participants.findIndex(
      p => p.email === user.email
    );

    if (participantIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event.' });
    }

    // Remove participant from event
    event.participants.splice(participantIndex, 1);
    await event.save();

    // Remove event from user's registeredEvents
    const dbUser = await User.findById(user._id);
    dbUser.registeredEvents = dbUser.registeredEvents.filter(
      evId => !evId.equals(event._id)
    );
    await dbUser.save();

    res.status(200).json({ message: 'Unregistered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unregistration failed', error: err.message });
  }
};


const getCurrentUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // remove password

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUserSocietyRegistrationRequests = async (req, res) => {
  console.log("[DEBUG] User fetching their society registration requests.");
  const user = req.user;
  console.log("[DEBUG] Current user:", user.username, user._id);

  try {
    // Find societies created by the user that are pending approval
    const pendingRegistrationRequests = await Society.find({
      createdBy: user._id,
      approved: false, // Assuming 'approved' field is false for pending requests
    });

    if (!pendingRegistrationRequests.length) {
      return res.status(404).json({ message: 'You have no pending society registration requests.' });
    }

    return res.status(200).json({ pendingRegistrationRequests });
  } catch (error) {
    console.error("[ERROR] Fetching user registration requests failed:", error);
    return res.status(500).json({ message: error.message });
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
  unregisterEvent,
  getCurrentUser,
  getProfile,
  getUserSocietyRegistrationRequests
}