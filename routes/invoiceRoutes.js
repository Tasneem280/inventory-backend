const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// GET INVOICES / REPORTS
router.get("/", verifyToken, isAdmin, invoiceController.getInvoices);

// SAVE NEW INVOICE
router.post("/", verifyToken, invoiceController.createInvoice);

module.exports = router;
