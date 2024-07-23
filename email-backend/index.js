import express from 'express';
import { createTransport } from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:3000','https://rentalapp-b93c4.web.app'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // If you need to support credentials (cookies, authorization headers)
}));

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debugging
});

app.post('/send-email', (req, res) => {
    const { userEmail, sellerEmail, propertyTitle, propertyDetails } = req.body;

    console.log('Received request to send email:');
    console.log('User Email:', userEmail);
    console.log('Seller Email:', sellerEmail);
    console.log('Property Title:', propertyTitle);
    console.log('Property Details:', propertyDetails);

    const mailOptionsToSeller = {
        from: userEmail,
        to: sellerEmail,
        subject: `Interest in your property: ${propertyTitle}`,
        text: `Hello, I am interested in your property. Here are the details: ${propertyDetails}`,
    };

    const mailOptionsToBuyer = {
        from: sellerEmail,
        to: userEmail,
        subject: `Details of the property you are interested in: ${propertyTitle}`,
        text: `Hello, here are the details of the property you showed interest in: ${propertyDetails}`,
    };

    transporter.sendMail(mailOptionsToSeller, (error, info) => {
        if (error) {
            console.error('Error sending email to seller:', error);
            return res.status(500).send(`Error sending email to seller: ${error.toString()}`);
        }
        console.log('Email sent to seller:', info.response);
    });
        transporter.sendMail(mailOptionsToBuyer, (error, info) => {
            if (error) {
                console.error('Error sending email to buyer:', error);
                return res.status(500).send(`Error sending email to buyer: ${error.toString()}`);
            }
            console.log('Email sent to buyer:', info.response);
            res.status(200).send('Emails sent successfully');
        });
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
