const express = require('express');
const multer = require('multer');
const { projectStorage } = require('../config/cloudinary'); // Cloudinary config
const Project = require('../models/Project');

const router = express.Router();
const upload = multer({  storage:projectStorage  });

// POST /api/projects
router.post('/', upload.fields([
  { name: 'mainImage' },
  { name: 'subImages' }
]), async (req, res) => {
  try {
    const { title, name, client, scale, location, size } = req.body;

    // Uploaded files
    const mainImageFile = req.files.mainImage?.[0] || null;
    const subImageFiles = req.files.subImages || [];

    // Extract Cloudinary URLs
    const mainImageUrl = mainImageFile?.path || null;
    const subImagesUrls = subImageFiles.map(file => file.path);

    const project = new Project({
      title,
      name,
      client,
      scale,
      location,
      size,
      mainImage: mainImageUrl,
      subImages: subImagesUrls,
    });

    await project.save();

    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    res.status(201).json({ message: "Project saved successfully", project });

  } catch (error) {
    console.error('❌ Error saving project:', error);
    res.status(500).json({ error: "Failed to save project" });
  }
});

// GET /api/projects?title=RESIDENTIAL
router.get('/', async (req, res) => {
  try {
    const { title } = req.query;

    const query = title && title !== 'ALL'
      ? { title: title.toUpperCase() }
      : {};

    const projects = await Project.find(query);
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Error fetching project by ID:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

router.put('/:id', upload.fields([
  { name: 'mainImage' },
  { name: 'subImages' }
]), async (req, res) => {
  try {
    const { title, name, client, scale, location, size, existingSubImages } = req.body;

    const mainImageFile = req.files.mainImage?.[0];
    const subImageFiles = req.files.subImages || [];

    // Parse existing subImages sent from client
    let existingSubImagesArr = [];
    if (existingSubImages) {
      try {
        existingSubImagesArr = JSON.parse(existingSubImages);
      } catch (err) {
        console.warn('Failed to parse existingSubImages:', err);
      }
    }

    // Combine existing subImages with newly uploaded images
    const newSubImagesUrls = subImageFiles.map(file => file.path);
    const combinedSubImages = [...existingSubImagesArr, ...newSubImagesUrls];

    const updatedFields = {
      title,
      name,
      client,
      scale,
      location,
      size,
    };

    if (mainImageFile) updatedFields.mainImage = mainImageFile.path;
    updatedFields.subImages = combinedSubImages;  // Always update with merged images

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project updated", project: updatedProject });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});



// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});





module.exports = router;
