require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser'); 
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const serviceRoutes = require("./routes/service");
const bookingRoutes = require('./routes/bookings');
const profileRoute = require('./routes/profile');
// const templatesRouter = require("./routes/template");
const htmlTemplates = require("./routes/htmlTemplates");

const divorseAgreement = require("./routes/divorceAgreementRoutes");


const document = require("./routes/documentroute");

// const form1 = require('./routes/form1data')


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/check-email', profileRoute);
// app.use("/api/templates", templatesRouter);

// app.use("/api/divorseagreement", form1);
app.use("/api/divorse-agreement", divorseAgreement);

app.use("/api/document", document);

app.use('/api', htmlTemplates);


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));