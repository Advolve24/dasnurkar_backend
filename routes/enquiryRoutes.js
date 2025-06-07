const express = require("express");
const router = express.Router();
const {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

// GET all enquiries
router.get("/", getAllEnquiries);

// GET a specific enquiry
router.get("/:id", getEnquiryById);

// POST a new enquiry
router.post("/", createEnquiry);

// PUT update an enquiry
router.put("/:id", updateEnquiry);

// DELETE an enquiry
router.delete("/:id", deleteEnquiry);

module.exports = router;
