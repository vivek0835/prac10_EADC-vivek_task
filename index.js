const express = require('express');
const bodyParser = require('body-parser');
const Cloudant = require('@cloudant/cloudant');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Cloudant credentials
const cloudantUsername = 'dc2fad17-c651-45fa-9239-86932c150670-bluemix';
const cloudantPassword = '36747c10d2058a769986ec8b42b7158';
const cloudantUrl = 'https://dc2fad17-c651-45fa-9239-86932c150670-bluemix.cloudantnosqldb.appdomain.cloud';

// Initialize Cloudant database
const cloudant = Cloudant({
  url: cloudantUrl,
  username: cloudantUsername,
  password: cloudantPassword
});
const db = cloudant.db.use('user_registration');

app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Registration Form</title>
    </head>
    <body>
        <h2>User Registration Form</h2>
        <form action="/register" method="POST">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required><br><br>

            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" required><br><br>

            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" required><br><br>

            <label for="city">City:</label>
            <input type="text" id="city" name="city" required><br><br>

            <label for="country">Country:</label>
            <input type="text" id="country" name="country" required><br><br>

            <label for="pincode">Pincode:</label>
            <input type="text" id="pincode" name="pincode" required><br><br>

            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
  `;
  res.send(htmlContent);
});

// Handle form submission
app.post('/register', (req, res) => {
  const userData = req.body;
  db.insert(userData, (err, body, header) => {
    if (err) {
      console.error('Error inserting data into Cloudant:', err);
      res.status(500).send('An error occurred while processing your request.');
    } else {
      console.log('Data inserted successfully:', body);
      res.status(200).send('Registration successful!');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
