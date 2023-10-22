const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 8000; // Port on which your server will run

// Define the storage for uploaded audio files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Store audio files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'uploads')));

// POST endpoint for uploading audio
app.post('/audio', upload.single('audio'), (req, res) => {
  if (req.file) {
    res.status(200).send('Audio uploaded successfully');
  } else {
    res.status(400).send('Failed to upload audio');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
