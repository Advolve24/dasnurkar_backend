const Blog = require('../models/Blog');

// CREATE blog
exports.createBlog = async (req, res) => {
  try {
    const { title, date, content } = req.body;
    const mainImageFile = req.file; // Assuming single image uploaded as 'mainImage'

    const blog = new Blog({
      title,
      date: date || new Date(),
      mainImage: mainImageFile?.path || '',
      content, // HTML from TipTap
    });

    await blog.save();
    res.status(201).json({ message: '✅ Blog created', blog });
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

// READ all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// READ one blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    console.error('❌ Error fetching blog by ID:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

// UPDATE blog
exports.updateBlog = async (req, res) => {
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

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.status(200).json({ message: '✅ Blog updated', blog });
  } catch (error) {
    console.error('❌ Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

// DELETE blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.status(200).json({ message: '🗑️ Blog deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
