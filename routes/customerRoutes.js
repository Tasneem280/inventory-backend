const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyToken } = require("../middleware/authMiddleware");

// GET ALL CUSTOMERS
router.get("/", verifyToken, customerController.getCustomers);

// ADD CUSTOMER
router.post("/", verifyToken, customerController.addCustomer);

// UPDATE CUSTOMER
router.put("/:id", verifyToken, customerController.updateCustomer);

// DELETE CUSTOMER
router.delete("/:id", verifyToken, customerController.deleteCustomer);

module.exports = router;
