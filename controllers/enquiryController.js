const Enquiry = require("../models/Enquiry");
const nodemailer = require("nodemailer");

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries", error });
  }
};

// Get a single enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiry", error });
  }
};

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
  const { name, phone, email, note } = req.body;

  try {
    // Save enquiry to database
    const newEnquiry = new Enquiry({ name, phone, email, note });
    await newEnquiry.save();

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });

    // Send email to company
    const mailOptions = {
      from: `"Website Enquiry" <${process.env.COMPANY_EMAIL}>`,
      to: process.env.COMPANY_EMAIL, // Send to company inbox
      subject: "New Enquiry Received",
      html: `
        <h3>You have a new enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Note:</strong><br>${note || "No additional message."}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Enquiry submitted and email sent", enquiry: newEnquiry });
  } catch (error) {
    res.status(400).json({ message: "Failed to create and send enquiry", error });
  }
};


// Update an existing enquiry
exports.updateEnquiry = async (req, res) => {
  try {
    const { name, phone, email, note } = req.body;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, note },
      { new: true }
    );
    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    res.status(400).json({ message: "Failed to update enquiry", error });
  }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deletedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete enquiry", error });
  }
};
