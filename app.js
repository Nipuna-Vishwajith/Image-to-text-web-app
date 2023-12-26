const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  // Process the uploaded file here
  // - Save the file to a specific location
  // - Update the relevant code to use the uploaded file
  // - Trigger the generation process

  res.send('File uploaded successfully');
});

// Start the server
app.listen(300, () => {
  console.log('Server started on port 3000');
});