//User Login Route
let express = require('express');
let router = express.Router();
let User = require('../model/userSchema'); // Ensure the path to userSchema is correct
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken'); 
let secret = 'your_jwt_secret'; // Replace with your actual secret key
router.get('/', (req, res) => {
  res.send('User login route');
});
// User login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
    
  try {
    // Find user by username
    const user = await User.find
        { username: username };
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }   
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }   
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 
// User registration route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Registration request received:', req.body);
  try {
    // Check if user already exists
    const existingUser = await User.findOne
        { username: username };
    // if (existingUser) {
    //   return res.status(400).json({ message: 'User already exists' });
    // }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      username: username, 
      password: hashedPassword
    });
    await newUser.save()
    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {   
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
    }
});
// Export the router
module.exports = router;