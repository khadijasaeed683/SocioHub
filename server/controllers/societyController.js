// controllers/societyController.js
const Society = require('../models/societyModel');
const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary');

async function migratePendingRequests() {
  try {
    const societies = await Society.find({});
    console.log(`Found ${societies.length} societies.`);

    for (const society of societies) {
      let updated = false; // Flag to save only if any change occurs

      // ✅ Migrate pendingRequests if needed
      // if (Array.isArray(society.pendingRequests) && society.pendingRequests.length > 0) {
      //   const firstItem = society.pendingRequests[0];
      //   if (!(firstItem && typeof firstItem === 'object' && firstItem.userId)) {
      //     const migratedRequests = society.pendingRequests.map(userId => ({
      //       userId,
      //       reason: "No reason provided (migrated).",
      //       requestedAt: new Date()
      //     }));
      //     society.pendingRequests = migratedRequests;
      //     updated = true;
      //     console.log(`Migrated pendingRequests for society ${society._id}`);
      //   } else {
      //     console.log(`Society ${society._id} pendingRequests already migrated. Skipping...`);
      //   }
      // }

      // ✅ Add deactivated field if not exists
      if (society.deactivated === undefined) {
        society.deactivated = false;
        updated = true;
        console.log(`Added deactivated field to society ${society.name}`);
      }

      // ✅ Save only if updated
      if (updated) {
        console.log(`saving society ${society.name}`);
        await society.save();
      }
    }

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}


const registerSociety = async (req, res) => {
  try {
    const user = req.user;
    console.log(user); // should print your cloud_name etc.

    const { name, description, website, contactEmail, phone, type } = req.body;
    console.log("Request body:", req.body);
    const logoFile = req.files.logo ? req.files.logo[0] : null;
    const coverFile = req.files.coverImage ? req.files.coverImage[0] : null;
    console.log("logoFile", logoFile.path);
    let logoUrl = '', coverUrl = '';
    if (logoFile) {
      const logoUpload = await cloudinary.uploader.upload(logoFile.path, { resource_type: 'image' });
      logoUrl = logoUpload.secure_url;
    }
    if (coverFile) {
      const coverUpload = await cloudinary.uploader.upload(coverFile.path, { resource_type: 'image' });
      coverUrl = coverUpload.secure_url;
    }

    console.log(logoUrl, coverUrl);
    // Check if user already has a pending request
    const existingRequest = await Society.findOne({
      name
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Society with this name already exists' });
    }

    const newRequest = await Society.create({

      description,
      logo: logoUrl,
      coverImage: coverUrl,
      website,
      name,
      socialLinks: {
        instagram: req.body['socialLinks.instagram'] || '',
        linkedin: req.body['socialLinks.linkedin'] || ''
      },
      contactEmail,
      phone,
      type,
      createdBy: user._id
    });

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { societies: societyId }
    });


    res.status(201).json({ message: 'Society registration requested', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSocieties = async (req, res) => {
  // migratePendingRequests();
  try {
    const societies = await Society.find();
    if (!societies.length) {
      return res.status(404).json({ message: 'No societies found' });
    }
    res.status(200).json({ societies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSocietiesByApprovalStatus = async (req, res) => {
  const { status } = req.query;

  let filter = {};

  if (status === 'approved') {
    filter = { approved: true };
  } else if (status === 'active') {
    filter = { approved: true, deactivated: { $ne: true } };
  } else if (status === 'inactive') {
    filter = { approved: true, deactivated: true };
  } else {
    return res.status(400).json({ message: 'Invalid status. Use one of: approved, active, inactive' });
  }

  try {
    const societies = await Society.find(filter);

    if (!societies.length) {
      return res.status(404).json({ message: 'No societies found for given status' });
    }

    res.status(200).json({ societies });
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getUserSocieties = async (req, res) => {
  console.log("User trying to get societies:");
  const user = req.user;
  console.log("User trying to get societies:", user.username, user._id);
  try {
    const registeredSocieties = await Society.find({ createdBy: user._id });
    const joinedSocieties = await Society.find({ members: user._id });

    if (!registeredSocieties.length && !joinedSocieties.length) {
      return res.status(404).json({ error: 'You have not registered/joined any society' });
    }
    return res.status(200).json({ registeredSocieties, joinedSocieties });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

const joinSociety = async (req, res) => {
  const user = req.user;
  const societyId = req.params.id;
  console.log("User trying to join society:", societyId, user._id);
  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }
    if (society.pendingRequests.some(req => req.userId.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'You have already sent a join request' });
    }

    if (society.members.includes(user._id)) {
      return res.status(400).json({ message: 'You are already a member of this society' });
    }
    if (society.createdBy.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'You are already admin of this society' });
    }
    if (!society.inductionsOpen) {
      return res.status(400).json({ message: 'Inductions for this society are currently closed' });
    }
    society.pendingRequests.push({ userId: user._id, reason: req.body.reason });
    await society.save();
    res.status(200).json({ message: 'Join request sent!', society });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleSocietyRegistrationRequest = async (req, res) => {
  try {
    const { societyId, action } = req.params;
    console.log("[DEBUG] Handle Society Request called with ID:", societyId, "Action:", action);

    // 1. Find the pendingSociety
    const pendingSociety = await Society.findById(societyId);
    console.log("[DEBUG] Fetched pendingSociety:", pendingSociety);

    if (!pendingSociety) {
      console.log("[DEBUG] Society not found in DB.");
      return res.status(404).json({ message: 'Society not found' });
    }

    if (action === 'approve') {
      if (pendingSociety.approved) {
        console.log("[DEBUG] Society already approved.");
        return res.status(400).json({ message: 'Society already approved' });
      }

      // Update approval status
      pendingSociety.approved = true;
      await pendingSociety.save();
      console.log("[DEBUG] Society approved status updated and saved.");

      // Promote user to society-head
      const updatedUser = await User.findByIdAndUpdate(
        pendingSociety.createdBy,
        {
          role: 'society-head',
          $push: { societies: pendingSociety._id },
        },
        { new: true }
      );
      console.log("[DEBUG] User promoted to society-head:", updatedUser);

      return res.status(200).json({
        message: 'Society approved and user promoted to society-head.',
        society: pendingSociety,
        user: updatedUser,
      });
    }

    else if (action === 'reject') {
      // Delete society document or mark as rejected
      await Society.findByIdAndDelete(societyId);
      console.log("[DEBUG] Society registration request rejected and deleted.");

      return res.status(200).json({
        message: 'Society registration request rejected and deleted.',
      });
    }

    else {
      console.log("[DEBUG] Invalid action:", action);
      return res.status(400).json({ message: 'Invalid action. Use approve or reject.' });
    }

  } catch (error) {
    console.error("[ERROR] Handle Society Request failed:", error);
    res.status(500).json({ message: error.message });
  }
};


const getJoinRequests = async (req, res) => {
  // migratePendingRequests();
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId)
      .populate('pendingRequests.userId');

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    console.log(society.pendingRequests);
    const requests = society.pendingRequests;

    return res.status(200).json({ requests });
  } catch (error) {
    console.error('Error in getJoinRequests:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const handleJoinRequest = async (req, res) => {
  const user = req.user; // Society head
  const { societyId, reqId, action } = req.params;
  console.log("Reg id: ", reqId);
  try {
    const society = await Society.findById(societyId).populate('pendingRequests.userId');
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    if (society.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only head can accept/reject requests' });
    }

    const requestIndex = society.pendingRequests.findIndex(
      request => request._id.toString() === reqId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: 'Request not found in pending requests' });
    }

    const requestedUserId = society.pendingRequests[requestIndex].userId._id;

    // Remove the request from pendingRequests
    society.pendingRequests.splice(requestIndex, 1);

    let requestedUser = null;

    if (action === 'accept') {
      // Add the requested user to members
      society.members.push(requestedUserId);

      requestedUser = await User.findById(requestedUserId); // fetch full user data

      await User.findByIdAndUpdate(requestedUser._id, {
        $addToSet: { societies: societyId }
      });

    }
    await society.save();

    res.status(200).json({
      success: true,
      message: `Request ${action}ed`,
      society,
      newMember: requestedUser // send back the added user
    });

  } catch (error) {
    console.error('Error in handleJoinRequest:', error);
    res.status(500).json({ error: error.message });
  }
};


const getSocietyMembers = async (req, res) => {
  try {
    const societyId = req.params.id;
    const society = await Society.findById(societyId).populate('members');

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    console.log(society.members);
    const members = society.members;

    return res.status(200).json({ members });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getSocietyById = async (req, res) => {
  const societyId = req.params.id;
  try {
    const society = await Society.findById(societyId).populate('members', 'username email');
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }
    res.status(200).json(society);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeMember = async (req, res) => {
  const user = req.user; // Society head
  const { societyId, memberId } = req.params;
  console.log("socid ", societyId, "memid ", memberId);
  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Only society head can remove members
    if (society.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only head can remove members' });
    }

    // Check if member exists in members list
    const isMember = society.members.includes(memberId);
    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this society' });
    }

    // Remove from society members
    society.members = society.members.filter(
      id => id.toString() !== memberId
    );

    await society.save();

    // Also remove society from user's societies list
    const memberUser = await User.findById(memberId);
    if (memberUser) {
      memberUser.societies = memberUser.societies.filter(
        id => id.toString() !== societyId
      );
      await memberUser.save();
    }

    res.status(200).json({ success: true, message: 'Member removed successfully', society });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateSociety = async (req, res) => {
  try {
    const societyId = req.params.id;

    const {
      name,
      description,
      contactEmail,
      website,
      phone,
      type,
      inductionsOpen,
      socialLinks // assume it comes as JSON string if sent via multipart/form-data
    } = req.body;

    const logoFile = req.files?.logo ? req.files.logo[0] : null;
    const coverFile = req.files?.coverImage ? req.files.coverImage[0] : null;

    // 🔍 Find existing society
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // 🔎 Check if new name is provided and it's not taken by another society
    if (name && name !== society.name) {
      const existing = await Society.findOne({ name });
      if (existing) {
        return res.status(400).json({ message: 'Society name already exists. Choose another name.' });
      }
      society.name = name;
    }

    // ✅ Update other fields if provided
    if (description) society.description = description;
    if (contactEmail) society.contactEmail = contactEmail;
    if (website) society.website = website;
    if (phone) society.phone = phone;
    if (type) society.type = type;
    if (inductionsOpen !== undefined) society.inductionsOpen = inductionsOpen === 'true' || inductionsOpen === true;

    // 🔗 Update social links if provided
    if (socialLinks) {
      try {
        const parsedLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        society.socialLinks = parsedLinks;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid socialLinks format. Must be JSON.' });
      }
    }

    // 🖼️ Upload new logo if provided
    if (logoFile) {
      const logoUpload = await cloudinary.uploader.upload(logoFile.path, { resource_type: 'image' });
      society.logo = logoUpload.secure_url;
    }

    // 🖼️ Upload new cover image if provided
    if (coverFile) {
      const coverUpload = await cloudinary.uploader.upload(coverFile.path, { resource_type: 'image' });
      society.coverImage = coverUpload.secure_url;
    }

    // 💾 Save updated society
    await society.save();

    res.status(200).json({ message: 'Society updated successfully', society });

  } catch (error) {
    console.error('Error updating society:', error);
    res.status(500).json({ message: 'Society update failed', error: error.message });
  }
};
const getAllSocietyRegistrationRequests = async (req, res) => {
  try {
    // Fetch all societies where approved is false (pending approval)
    const pendingSocieties = await Society.find({ approved: false })
      .populate('createdBy', 'username email') // populate requested user info
      .sort({ createdAt: -1 }); // latest requests first

    return res.status(200).json({
      message: 'Pending society registration requests fetched successfully.',
      count: pendingSocieties.length,
      pendingSocieties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const toggleSocietyActivation = async (req, res) => {
  try {
    const societyId = req.params.societyId;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    society.deactivated = !society.deactivated;
    await society.save();

    res.status(200).json({
      message: `Society has been ${society.deactivated ? 'deactivated' : 'activated'}.`,
      deactivated: society.deactivated,
    });
  } catch (error) {
    console.error("[ERROR] Toggle Society Activation:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteSociety = async (req, res) => {
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    await Society.findByIdAndDelete(societyId);

    res.status(200).json({ message: 'Society deleted successfully.' });
  } catch (error) {
    console.error("[ERROR] Delete Society:", error);
    res.status(500).json({ message: 'Server error while deleting society.' });
  }
};
module.exports = {
  registerSociety,
  getUserSocieties,
  getAllSocieties,
  joinSociety,
  handleSocietyRegistrationRequest,
  updateSociety,
  getJoinRequests,
  handleJoinRequest,
  getSocietyMembers,
  getSocietyById,
  removeMember,
  getAllSocietyRegistrationRequests,
  getUserSocietyRegistrationRequests,
  toggleSocietyActivation,
  deleteSociety, getSocietiesByApprovalStatus
};
