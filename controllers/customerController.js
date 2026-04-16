const Customer = require("../models/Customer");

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// ADD CUSTOMER
const addCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });

    const customer = new Customer({ name, phone, email });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: "Add failed" });
  }
};

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Customer not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
};
