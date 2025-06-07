const express = require('express');
const multer = require('multer');
const { blogStorage } = require('../config/cloudinary');
const Blog = require('../models/Blog');

const router = express.Router();
const upload = multer({ storage: blogStorage });

// CREATE a new blog
router.post('/', upload.single('mainImage'), async (req, res) => {
  try {
    const { title, date, content } = req.body;
    const mainImageFile = req.file;

    const blog = new Blog({
      title,
      date: date || new Date(),
      mainImage: mainImageFile?.path || '',
      content, // TipTap HTML string
    });

    await blog.save();
    res.status(201).json({ message: '✅ Blog created', blog });
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// READ all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// READ one blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    console.error('❌ Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// UPDATE blog by ID
router.put('/:id', upload.single('mainImage'), async (req, res) => {
  try {
    const { title, date, content } = req.body;
    const mainImageFile = req.file;

    const updateData = {
      title,
      date: date || new Date(),
      content,
    };

    if (mainImageFile) {
      updateData.mainImage = mainImageFile.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBlog) return res.status(404).json({ error: 'Blog not found' });

    res.status(200).json({ message: '✅ Blog updated', blog: updatedBlog });
  } catch (error) {
    console.error('❌ Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// GET /api/blogs/stats/count
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("❌ Error counting blogs:", error);
    res.status(500).json({ error: "Failed to get blog count" });
  }
});


// DELETE blog by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json({ message: '🗑️ Blog deleted' });
  } catch (error) {
    console.error('❌ Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
