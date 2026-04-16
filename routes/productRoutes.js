const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");


//  GET ALL PRODUCTS
router.get("/", verifyToken, productController.getProducts);


//  ADD PRODUCT
router.post("/", verifyToken, isAdmin, productController.addProduct);


// UPDATE PRODUCT
router.put("/:id", verifyToken, productController.updateProduct);

//  DELETE PRODUCT
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

// PURCHASE
router.post("/purchase", verifyToken, productController.purchaseProduct);

module.exports = router;
