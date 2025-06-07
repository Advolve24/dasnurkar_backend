const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, name, client, scale, location, size } = req.body;

    const mainImage = req.files?.['mainImage']?.[0]?.path || null;
    const subImages = req.files?.['subImages']?.map(img => img.path) || [];

    const newProject = new Project({
      title,
      name,
      client,
      scale,
      location,
      size,
      mainImage,
      subImages,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Project creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('❌ Fetch projects error:', err);
    res.status(500).json({ error: err.message });
  }
};
