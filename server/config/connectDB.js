const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    await mongoose.connect(process.env.MONGO_URI + 'eventnest')
}

module.exports = connectDB;
//connect to databse
// mongoose.connect(process.env.MONGO_URI)
//       .then(() => {
//         // listen for requests once connected to db
//         app.listen(process.env.PORT, () => {
//           console.log('Connected to DB and server is running on port', process.env.PORT);
//         });
//       })
//       .catch((error) => {
//         console.log('Error connecting to the database:', error);
//       });