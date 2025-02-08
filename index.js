const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const express = require("express");
const app = express();

// No cache middleware
const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};
// Set the view engine to EJS
app.set("view engine", "ejs");

app.use(noCache);

// For user route
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

// For admin route
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

// 404 error handling middleware
app.use((req, res, next) => {
  res.status(404).render('404'); // Assuming '404.ejs' is in the views folder
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running...");
});
