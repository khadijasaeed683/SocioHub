const Event = require('../models/eventModel');
const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary'); 
const nodemailer = require('nodemailer');
const generateQRCode = require('../utils/generateQRCode');
const parseTimeToDate = require('../utils/parseTime'); 
const generateEventPoster = require('../utils/generateEventPoster'); // Assuming you have a utility to generate posters

const createEvent = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, startTime, endTime, location, date, isPublic } = req.body;
    const societyId = req.params.societyId;
    const posterFile = req.files.poster ? req.files.poster[0] : null;
    let posterUrl = '';

    //  Convert date to Date object and set today's date for comparison
    const eventDate = new Date(date);
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (eventDate < todayDateOnly) {
      return res.status(400).json({ message: 'Event date must be in the future' });
    }

    //  Parse start and end times
    const startTimeDate = parseTimeToDate(startTime);
    const endTimeDate = parseTimeToDate(endTime);

    if (eventDateOnly.getTime() === todayDateOnly.getTime()) {
      const currentTime = new Date();
      if (startTimeDate <= currentTime) {
        return res.status(400).json({ message: 'Event start time must be in the future' });
      }
    }

    if (endTimeDate <= startTimeDate) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    if (posterFile) {
      const posterUpload = await cloudinary.uploader.upload(posterFile.path, { resource_type: 'image' });
      posterUrl = posterUpload.secure_url;
    }

    // Check for conflicting events at the same location on same date and overlapping times
    const conflictingEvent = await Event.findOne({
      location,
      date: eventDate,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingEvent) {
      return res.status(400).json({
        message: `Location is already booked for another event (${conflictingEvent.title}) at this date and time.`
      });
    }
    // posterUrl = await generateEventPoster({ title, description, startTime, endTime, location, date: eventDate, societyId });
    //  Create new event
    const newEvent = await Event.create({
      title,
      poster: posterUrl,
      description,
      startTime,
      endTime,
      location,
      date: eventDate,
      societyId,
      isPublic
    });
     // Generate poster using OpenAI
    res.status(201).json({ message: 'Event created successfully', event: newEvent });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const societyId = req.params.societyId;
    const { upcoming } = req.query; // get upcoming param from query
    console.log("societyId", societyId, "upcoming:", upcoming);

    if (!societyId) {
      return res.status(400).json({ message: 'Society ID is required' });
    }

    const filter = { societyId };

    if (upcoming === 'true') {
      const now = new Date();
      filter.date = { $gte: now }; // only events today or in future
    }

    const events = await Event.find(filter)
      .populate('societyId', 'name logo')
      .populate('participants', 'name email')
      .sort({ date: 1, startTime: 1 }); // sort upcoming earliest first

    if (!events || events.length === 0) {
      return res.status(404).json({ message: upcoming === 'true' ? 'No upcoming events found for this society' : 'No events found for this society' });
    }

    return res.status(200).json(events);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};



const getPublicEvents = async (req, res) => {
  try {
    
    const events = await Event.find({  })
        .populate('societyId', 'name logo')
        .populate('participants', 'name email')
        .sort({ createdAt: -1 });
    if (!events || events.length === 0) {
        return res.status(404).json({ message: 'No events found for this society' });
    }
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const event = await Event.findById(eventId)
      .populate('societyId', 'name logo')
      .populate('participants', 'name email');
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
        }
    return res.status(200).json(event);
    }
    catch (error) {
    return res.status(500).json({ message: error.message });
    }
}

const registerForEvent = async (req, res) => {
  try {
    const { email, name, phone } = req.body;
    const eventId = req.params.id;
    console.log('Register request body:', req.body);

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const user = await User.findOne({ email });

    //  Check if already registered as user or guest
    const alreadyRegistered = event.participants.find(p =>
      (p.user && user && p.user.equals(user._id)) ||
      (!p.user && p.email === email)
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You have already registered for this event.' });
    }

    //  Check event type and allow accordingly
    if (event.isPublic) {
      console.log("public event")
      // Public event: allow guest or registered user
      if (user) {
        event.participants.push({
          name,
          email,
          phone,
          isGuest: false
        });
        user.registeredEvents.push(event._id);
      } else {
        event.participants.push({
          name,
          email,
          phone,
          isGuest: true
        });
      }
    } else {
      // Private event: only registered users
      if (!user) {
        return res.status(401).json({ message: 'You must be registered to RSVP for this private event.' });
      }
      event.participants.push({
        name,
        email,
        phone,
        isGuest: false
      });
      user.registeredEvents.push(event._id);
    }

    await event.save();

    //  Generate QR code
    const qrText = `Event: ${event.title}\nName: ${name}\nEmail: ${email}\nDate: ${event.date}`;
    const qrCodeDataURL = await generateQRCode(qrText);

    
    // ✅ Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Ticket for ${event.title}`,
      text: `Hi ${name},\n\nYou have successfully registered for ${event.title}.\nPlease find your QR ticket attached.\n\nThank you.`,
      attachments: [{
        filename: 'ticket.png',
        content: qrCodeDataURL.split("base64,")[1],
        encoding: 'base64'
      }]
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Registered successfully. Ticket sent to email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime, location, date, isPublic } = req.body;
    const eventId = req.params.id;
    const posterFile = req.files.poster ? req.files.poster[0] : null;

   

    //  Find existing event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    //  Update fields if provided
    if (title) event.title = title;
    if (description) event.description = description;
    if (location) event.location = location;
    if (isPublic !== undefined) event.isPublic = isPublic;

    //  Validate and update date if provided
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (eventDate < todayDateOnly) {
        return res.status(400).json({ message: 'Event date must be in the future' });
      }
      event.date = eventDate;
    }

    //  Validate and update times if provided
    let startTimeDate, endTimeDate;
    if (startTime) startTimeDate = parseTimeToDate(startTime);
    if (endTime) endTimeDate = parseTimeToDate(endTime);

    if (startTime && endTime && endTimeDate <= startTimeDate) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;

    //  Upload new poster if provided
    if (posterFile) {
      const posterUpload = await cloudinary.uploader.upload(posterFile.path, { resource_type: 'image' });
      event.poster = posterUpload.secure_url;
    }
    // event.poster = await generateEventPoster(event); // Generate poster using OpenAI
    //  Check for conflicting events at same location, date, and overlapping time
    const conflictingEvent = await Event.findOne({
      _id: { $ne: eventId }, // Exclude this event
      location: event.location,
      date: event.date,
      $or: [
        {
          startTime: { $lt: event.endTime },
          endTime: { $gt: event.startTime }
        }
      ]
    });

    if (conflictingEvent) {
      return res.status(400).json({
        message: `Location is already booked for another event (${conflictingEvent.title}) at this date and time.`
      });
    }

    //  Save updated event
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Event update failed', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Event deletion failed', error: error.message });
  }
};


module.exports = { createEvent, getAllEvents, getEventById, registerForEvent , updateEvent , deleteEvent ,getPublicEvents
};