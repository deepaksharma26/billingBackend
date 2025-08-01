//connect mongo atlas
let mongoose = require('mongoose');
// let mongoDB = 'mongodb+srv://ds75279:bXtjpC1X9MFCOzQO@temh.x0dtnoh.mongodb.net/';
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err)); 

const uri = "mongodb+srv://ds75279:bXtjpC1X9MFCOzQO@temh.x0dtnoh.mongodb.net/temh?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));
// Export the mongoose connection
module.exports = mongoose;
