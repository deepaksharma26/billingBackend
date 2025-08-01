let express = require('express');
let router = express.Router();
let billingCategoryModel = require('../model/billingcategoryModel'); // Ensure the path to category model is correct
let authMiddleware = require('../middleware/auth'); // Ensure you have an auth middleware for authentication
let multer = require('multer');
let upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Get all categories
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await billingCategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Create a new category
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.path : null; // Get the uploaded file path
  const createdBy = req.user.id; // Assuming req.user contains the authenticated user's info    
    try {
        const newCategory = new billingCategoryModel({
        name,
        description,
        image,
        createdBy,
        updatedBy: createdBy, // Set the creator as the updater initially
        });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a category
router.put('/categories/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file ? req.file.path : null; // Get the uploaded file path      
    const updatedBy = req.user.id; // Assuming req.user contains the authenticated user's info
    try {
        const category = await billingCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = name || category.name;  
        category.description = description || category.description;
        category.image = image || category.image; // Update image if provided
        category.updatedBy = updatedBy; // Update the updater info
        category.updatedAt = Date.now(); // Update the timestamp
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a category
router.delete('/categories/:id', authMiddleware, async (req, res) => {          
    const { id } = req.params;
    try {
        const category = await billingCategoryModel.findById(id);
        if  (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await categoryModel.deleteOne({ _id: id });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error' });
    }       
});
// Export the router
module.exports = router;