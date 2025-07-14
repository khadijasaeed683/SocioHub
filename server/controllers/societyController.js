// controllers/societyController.js
const Society = require('../models/societyModel');
const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary'); 

async function migratePendingRequests() {
  try {


    // Find all societies
    const societies = await Society.find({});
    console.log(`Found ${societies.length} societies.`);

    for (const society of societies) {
      if (Array.isArray(society.pendingRequests) && society.pendingRequests.length > 0) {
        // Check if already migrated (skip if it's an array of objects)
        const firstItem = society.pendingRequests[0];
        if (firstItem && typeof firstItem === 'object' && firstItem.userId) {
          console.log(`Society ${society._id} already migrated. Skipping...`);
          continue;
        }

        // Convert each userId to new object structure
        const migratedRequests = society.pendingRequests.map(userId => ({
          userId,
          reason: "No reason provided (migrated).",
          requestedAt: new Date()
        }));

        society.pendingRequests = migratedRequests;
        await society.save();
        console.log(`Migrated pendingRequests for society ${society._id}`);
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

    const { name, description, website, contactEmail, phone, type  } = req.body;
    console.log("Request body:", req.body);
    const logoFile = req.files.logo ? req.files.logo[0] : null;
    const coverFile = req.files.coverImage ? req.files.coverImage[0] : null;
    console.log("logoFile", logoFile.path);
    let logoUrl = '', coverUrl = '';
    if(logoFile)
    {
      const logoUpload = await cloudinary.uploader.upload(logoFile.path, {resource_type: 'image'});
      logoUrl = logoUpload.secure_url;
    }
    if(coverFile)
    {
      const coverUpload = await cloudinary.uploader.upload(coverFile.path, {resource_type:'image'});
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
    user.societies.push(newRequest._id);

    await user.save();

    res.status(201).json({ message: 'Society registration requested', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSocieties = async (req, res) => {
    
  try {
    const societies = await Society.find();
    if (!societies.length) {
      return res.status(404).json({ message: 'No societies found' });
    }
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const joinSociety = async (req, res) => {
  const user = req.user;
  const societyId = req.params.id;
  console.log("User trying to join society:", societyId, user._id);
  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }
    if(society.pendingRequests.includes(user._id)) {
      return res.status(400).json({ message: 'You have already sent a join request' });
    }
    if (society.members.includes(user._id)) {
      return res.status(400).json({ message: 'You are already a member of this society' });
    }
    if(society.createdBy.toString() === user._id.toString())
    {
      return res.status(400).json({ message: 'You are already admin of this society' });
    }
    if (!society.inductionsOpen) {
      return res.status(400).json({ message: 'Inductions for this society are currently closed' });
    }
    society.pendingRequests.push({userId: user._id, reason: req.body.reason});
    await society.save();
    res.status(200).json({ message: 'Join request sent!', society });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveSociety = async (req, res) => {
  try {
    const pendingSocietyId = req.params.id;
    console.log("Pending Society ID:", pendingSocietyId);
    // 1. Find the pendingSociety
    const pendingSociety = await Society.findById(pendingSocietyId);

    if (!pendingSociety || pendingSociety.approved) {
      return res.status(404).json({ message: 'Society not found or already registered' });
    }

    await Society.findByIdAndUpdate(pendingSocietyId,{
      approved: true
    });
    // 3. Promote user to society-head
    await User.findByIdAndUpdate(pendingSociety.pendingSocietyedBy, {
      role: 'society-head',
      societies: society._id
    });

    // 4. Update pendingSociety status
    pendingSociety.status = 'approved';
    await pendingSociety.save();

    return res.status(200).json({
      message: 'Society approved and user promoted to society-head.',
      society
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJoinRequests = async (req, res) => {
  // migratePendingRequests();
  try {
    const societyId = req.params.id;

    const society = await Society.findById(societyId)
      .populate('pendingRequests.userId', 'username email pfp');

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    console.log(society.pendingRequests);
    // Format each pending request with user credentials
    const requests = society.pendingRequests.map((request) => ({
      _id: request._id,
      userId: request.userId._id,
      name: request.userId.username,
      email: request.userId.email,
      avatar: request.userId.pfp || '', // or .avatar if your User schema uses 'avatar'
      reason: request.reason,
      requestedAt: request.requestedAt,
    }));

    return res.status(200).json({ requests });
  } catch (error) {
    console.error('Error in getJoinRequests:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




const handleJoinRequest = async (req, res) => {
  const user = req.user;
  const { societyId, reqId, action } = req.params;

  try {
    const society = await Society.findById(societyId).populate('pendingRequests.userId');
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    if (society.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only head can accept/reject requests' });
    }

    console.log("Pending Requests:", user._id.toString(), society.pendingRequests);

    // const requestExists = society.pendingRequests.some(
    //   request => request.userId._id.toString() === user._id
    // );

    // if (!requestExists) {
    //   return res.status(400).json({ message: 'User has not requested to join this society' });
    // }

    // Remove the request from pendingRequests
    society.pendingRequests = society.pendingRequests.filter(
      request => request.userId._id.toString() !== user._id
    );
    //adding current user to members innstead of user who requested
    if (action === 'accept') {
      // Add to members
      society.members.push(user._id);

      const requestedUser = await User.findById(user._id);
      requestedUser.societies.push(societyId);
      await requestedUser.save();
    }

    await society.save();

    res.status(200).json({ success: true, message: `Request ${action}ed`, society });
  } catch (error) {
    console.error('Error in handleJoinRequest:', error);
    res.status(500).json({ error: error.message });
  }
};



const getSocietyMembers = async (req, res) => {
  try {
    const societyId = req.params.id;
    const society = await Society.findById(societyId).populate('members', 'username email pfp');

    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    console.log(society.members);
    const members = society.members.map((m) => ({
      _id: m._id,
      name: m.username,
      email: m.email,
      role: m.role,
      avatar: m.pfp || '',
    }));

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
    res.status(200).json( society );
  } catch (error) {
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

module.exports = { registerSociety, 
                  getUserSocieties, 
                  getAllSocieties, 
                  joinSociety, 
                  approveSociety, 
                  updateSociety,
                  getJoinRequests, 
                  handleJoinRequest,
                  getSocietyMembers,
                  getSocietyById
                  };
