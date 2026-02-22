/** @format */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const exerciseRoutes = require("./routes/exercises");
const workoutRoutes = require("./routes/workouts");
const templateRoutes = require("./routes/templates");

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/templates", templateRoutes);

app.get("/", (req, res) => {
  res.send("GymTracker API is running! 🚀");
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
