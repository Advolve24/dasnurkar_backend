const express = require('express');
const multer = require('multer');
const { logoStorage } = require('../config/cloudinary'); // ✅ Create a separate config for client uploads
const Client = require('../models/Client');

const router = express.Router();
const upload = multer({ storage: logoStorage });

// CREATE a new client
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { clientName } = req.body;
    const logoFile = req.file;

    const client = new Client({
      clientName,
      logo: logoFile?.path || '',
    });

    await client.save();
    res.status(201).json({ message: '✅ Client created', client });
  } catch (error) {
    console.error('❌ Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// READ all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// READ one client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json(client);
  } catch (error) {
    console.error('❌ Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// UPDATE client by ID
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { clientName } = req.body;
    const logoFile = req.file;

    const updateData = {
      clientName,
    };

    if (logoFile) {
      updateData.logo = logoFile.path;
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedClient) return res.status(404).json({ error: 'Client not found' });

    res.status(200).json({ message: '✅ Client updated', client: updatedClient });
  } catch (error) {
    console.error('❌ Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// GET /api/clients/stats/count
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Client.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("❌ Error counting clients:", error);
    res.status(500).json({ error: "Failed to get client count" });
  }
});


// DELETE client by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json({ message: '🗑️ Client deleted' });
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;
