require("dotenv").config();
const express = require("express");
const http = require("http"); // Add http module to create a server
const socketIo = require("socket.io"); // Import socket.io
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
const blogRoutes = require("./routes/blogRoutes");

const khaltiRoutes = require("./routes/khalti");  


const divorseAgreement = require("./routes/divorceAgreementRoutes");
const partnershipAgreement = require("./routes/partnershipAgreementRoutes");
const document = require("./routes/documentroute");
const contactRoutes = require("./routes/contactRoutes");
const replyEmail = require("./routes/replyEmailRoute");
const sendEmailRoute = require("./routes/sendDocumentMail"); 
const paymentCallbackRouter = require('./routes/paymentCallback');

const notificationRoutes = require("./routes/notificationRoutes");



// database connection
connection();

// middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



// Use the Khalti routes
app.use("/api", khaltiRoutes);

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/reply", replyEmail);
app.use('/api/check-email', profileRoute);
app.use('/sendemail',sendEmailRoute);
app.use("/api/blogs", blogRoutes);



// app.use("/api/templates", templatesRouter);
app.use("/api/divorse-agreement", divorseAgreement);
app.use("/api/partnership-agreement", partnershipAgreement);
app.use("/api/document", document);
app.use('/api', htmlTemplates);
app.use('/payment-callback', paymentCallbackRouter);

app.use("/api/notifications", notificationRoutes);

// Create an HTTP server using Express app
const server = http.createServer(app);

// Set up Socket.IO with the server
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow any origin or specify your frontend URL, e.g., 'http://localhost:3000'
    methods: ['GET', 'POST'],
  },
});


const Notification = require("./models/notificationModdel"); 

const clients = {}; // To store the clientId and associated socket ID

io.on('connection', (socket) => {
  console.log('a user connected');

  // When a client sends their `clientId`, store the socket ID associated with it
  socket.on('register', (clientId) => {
    clients[clientId] = socket.id;
    console.log(`Client ${clientId} connected with socket ID: ${socket.id}`);
  });

  // Listen for the 'sendFormNotification' event from admin side
  socket.on('sendFormNotification', async (notificationData) => {
    const { clientId,serviceId, message, buttonText, redirectUrl } = notificationData;

    // Log the notification data to see if it's being received
    console.log('Received notification data:', notificationData);

    try {
      // Save the notification to the database
      const newNotification = new Notification({
        clientId,
        serviceId,
        message,
        buttonText,
        redirectUrl,
      });
      await newNotification.save(); // Save to DB
      console.log("Notification saved to DB");

      // Check if we have a socket connection for this clientId
      if (clients[clientId]) {
        io.to(clients[clientId]).emit('receiveNotification', {
          message,
          buttonText,
          redirectUrl,
        });
        console.log(`Notification sent to client ${clientId}`); // Log that the notification was sent
      } else {
        console.log(`No client found with clientId: ${clientId}`);
      }
    } catch (error) {
      console.error('Error saving notification to DB:', error.message);
    }
  });

});




// Start the server
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});





// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const bodyParser = require('body-parser'); 
// const connection = require("./db");
// const userRoutes = require("./routes/user");
// const authRoutes = require("./routes/auth");
// const passwordResetRoutes = require("./routes/passwordReset");
// const serviceRoutes = require("./routes/service");
// const bookingRoutes = require('./routes/bookings');
// const profileRoute = require('./routes/profile');
// // const templatesRouter = require("./routes/template");
// const htmlTemplates = require("./routes/htmlTemplates");

// const divorseAgreement = require("./routes/divorceAgreementRoutes");


// const document = require("./routes/documentroute");

// // const form1 = require('./routes/form1data')


// // database connection
// connection();

// // middlewares
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// // routes
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/password-reset", passwordResetRoutes);
// app.use("/api/services", serviceRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/check-email', profileRoute);
// // app.use("/api/templates", templatesRouter);

// // app.use("/api/divorseagreement", form1);
// app.use("/api/divorse-agreement", divorseAgreement);

// app.use("/api/document", document);

// app.use('/api', htmlTemplates);


// const port = process.env.PORT || 8080;
// app.listen(port, console.log(`Listening on port ${port}...`));