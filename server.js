require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/adminRoute");
const usersRoutes = require("./routes/usersRoute");
const candidateRoutes = require("./routes/candidatesRoute");
const votesRoutes = require("./routes/votesRoute");
const authRoutes = require("./routes/authRoute");
const associationRoute = require("./routes/associationRoute");
const cors = require('cors');


const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://admin-dashboard-frontend-livid.vercel.app', 'https://acses-e-voting-frontend.vercel.app'],
}));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/associations", associationRoute);

// Connection to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listening for request
    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT} & MongoDB conected!!`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
