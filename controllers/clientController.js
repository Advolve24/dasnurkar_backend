const Client = require('../models/Client');

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { clientName } = req.body;
    const logo = req.file?.path || req.body.logo;

    if (!logo) return res.status(400).json({ error: 'Logo is required' });

    const client = new Client({ clientName, logo });
    await client.save();

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const { clientName } = req.body;
    const logo = req.file?.path || req.body.logo;

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { clientName, logo },
      { new: true, runValidators: true }
    );

    if (!updatedClient) return res.status(404).json({ error: 'Client not found' });

    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Client not found' });

    res.json({ message: 'Client deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
