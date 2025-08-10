// user authentication 
let express = require('express');
let router = express.Router();
let User = require('../model/userSchema'); // Ensure the path to userSchema is correct
let userRoleModel = require('../model/userRoleModel'); // Ensure the path to userRoleModel is correct
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
dotenv.config();
let authMiddleware = require('../middleware/auth'); // Ensure the path to auth middleware is correct

let secret = process.env.JWT_SECRET; // Replace with your actual secret key
//get all users route
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, {
      firstname: 1,
      lastname: 1,
      username: 1,
      email: 1,
      mobilenumber: 1,
      role: 1,
      status: 1,
      profilePicture: 1,
      rolename: 1,
    }).populate({
      path: 'role', // field in userSchema
      model: userRoleModel, // model name as string
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login route
router.post('/login', async(req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }else if(user?.isActive == false){
      return res.status(403).json({ message: 'User is inactive' });
    }
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { 
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id, 
        issuer: process.env.ISSUER || '', // Optional: Add issuer for additional security
        audience: process.env.AUDIENCE || '', // Optional: Add audience for additional security
        data:
        {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            mobilenumber: user.mobilenumber,
            role: user.role,
            status: user.status,
            profilePicture: user.profilePicture,

        } }, secret, { expiresIn: process.env.JWT_EXPIRATION || '12h' }); // Set token expiration time
    // Update user's token in the database
    const updateToken = await User.updateOne({ username: user.username }, { $set: { token: token, lastLogin: Date.now() } });
    if (updateToken.modifiedCount === 0) {
      console.error('Token update failed for user:', username);
      return res.status(500).json({ message: 'Token update failed' });
    }
    res.status(200).json({ message: 'User Succesfully Logged In',token:token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// User registration route
router.post('/register', async (req, res) => {  
    const { username, password, email, firstname, lastname, createdBy, role, status } = req.body;
    console.log('Registration request received:', req.body);
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
        email: email,
        firstname: firstname,
        lastname: lastname,
        mobilenumber: req.body.mobilenumber,
        status: status || false, // Default to false if not provided
        role: role || 0, // Default to 0 (user) if not provided
        createdBy: req.user ? req.user.id : 'self', // Assuming req.user contains the authenticated user's info
        createdAt: new Date(),
        username: username,
        password: hashedPassword
        });
        await newUser.save();
        console.log('User registered successfully:', newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
//change password route
router.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  try {
    // Find user by username
    const user = await User.find({ username: username });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Compare old password with hashed password
    const isMatch = await bcrypt.compare(oldPassword, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid old password' });
    }
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Update user's password in the database
    const updatePassword = await User.updateOne({ username: user[0].username }, { $set: { password: hashedNewPassword } });
    if (updatePassword.modifiedCount === 0) {
      console.error('Password update failed for user:', username);
      return res.status(500).json({ message: 'Password update failed' });
    }
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//update user 
router.put('/update-user/:id', authMiddleware, async (req, res) => {
  const userId = req.params.id;
  const { firstname, lastname, email, mobilenumber, status, role } = req.body;
  console.log('Update user request received:', req.body);
  try {
    // Find user by ID and update
    const updatedUser = await User.findByIdAndUpdate({_id:userId}, {
      firstname,
      lastname,
      email,
      mobilenumber,
      status,
      role, // Default to 0 (user) if not provided
      updatedBy: req.user._id, // Assuming req.user contains the authenticated user's info
      updatedAt: new Date() // Optional: Add updated timestamp
    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// User logout route
router.post('/logout', (req, res) => {
  // Invalidate the token on the client side
  res.status(200).json({ message: 'User logged out successfully' });
});

// Export the router
module.exports = router;