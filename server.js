require("dotenv").config(); // ✅ load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// ✅ Middleware
app.use(cors());
app.use(express.json());


// ✅ Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/invoices", invoiceRoutes);


// ✅ MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ DB Error:", err));


// ✅ Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// ✅ Port (Render uses process.env.PORT)
const PORT = process.env.PORT || 5000;


// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});