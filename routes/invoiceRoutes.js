const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// GET INVOICES / REPORTS
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// SAVE NEW INVOICE
router.post("/", verifyToken, async (req, res) => {
  try {
    const { cart, subtotal, tax, discount, total } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Process product stock deduction
    for (let item of cart) {
      const product = await Product.findById(item._id);
      if (!product) continue;
      
      if (product.quantity < item.qty) {
        return res.status(400).json({
          error: `Not enough stock for ${product.name}`,
        });
      }
      product.quantity -= item.qty;
      await product.save();
    }

    // Save Invoice
    const invoice = new Invoice({
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty
      })),
      subtotal,
      tax,
      discount,
      total
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invoice creation failed" });
  }
});

module.exports = router;
