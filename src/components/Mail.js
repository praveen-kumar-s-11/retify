const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create a transport object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'prxvn1@gmail.com', // Your Gmail email address
    pass: '', // Your Gmail password
  },
});

// Define the Cloud Function to send emails
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Extract data from the request
  const { buyerEmail, sellerEmail, propertyTitle } = data;

  try {
    // Send email to buyer
    await transporter.sendMail({
      from: 'prxvn1@gmail.com',
      to: buyerEmail,
      subject: `Interested in ${propertyTitle}`,
      text: `Dear buyer,\n\nThank you for your interest in ${propertyTitle}. Please contact the seller at ${sellerEmail} for further details.\n\nBest regards,\nYour Real Estate Team`,
    });

    // Send email to seller
    await transporter.sendMail({
      from: 'prxvn1@gmail.com',
      to: sellerEmail,
      subject: `Interested buyer for ${propertyTitle}`,
      text: `Dear seller,\n\nYou have received interest in your property "${propertyTitle}" from a potential buyer. You can contact them at ${buyerEmail}.\n\nBest regards,\nYour Real Estate Team`,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Email sending failed');
  }
});
