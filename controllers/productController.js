const Product = require("../models/Product");

// =======================
// ✅ GET ALL PRODUCTS
// =======================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// =======================
// ✅ ADD PRODUCT
// =======================
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await Product.findOne({ name });

    if (existing) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const product = new Product({
      name,
      price,
      quantity,
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Add failed" });
  }
};

// =======================
// ✅ UPDATE PRODUCT
// =======================
const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;

    if (req.user.role === "Admin") {
      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = price;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// =======================
// ✅ DELETE PRODUCT
// =======================
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// =======================
// ✅ PURCHASE
// =======================
const purchaseProduct = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

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

    res.json({ message: "Purchase successful" });
  } catch (err) {
    res.status(500).json({ error: "Purchase failed" });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  purchaseProduct
};
