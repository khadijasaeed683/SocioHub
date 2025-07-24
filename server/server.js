require('dotenv').config();

const connectDB = require('./config/connectDB');
// const connectCloudinary = require('./config/cloudinary');
const express = require('express');

const authRoutes = require('./routes/authRoutes');
const societyRoutes = require('./routes/societyRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const publicEventRoutes = require('./routes/publicEventRoutes');
const userRoutes = require('./routes/userRoutes'); // Uncomment if needed
const app = express();
connectDB();
// connectCloudinary();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/society', societyRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/explore-events', publicEventRoutes);
app.use('/api/user', userRoutes); // Uncomment if needed

app.listen(process.env.PORT, () => {
  console.log('server is running on port', process.env.PORT);
});
