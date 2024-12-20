require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const serviceRoutes = require("./routes/service");
const bookingRoutes = require('./routes/bookings');
const profileRoute = require('./routes/profile');



// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/check-email', profileRoute);


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));