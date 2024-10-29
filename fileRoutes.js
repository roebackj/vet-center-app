const express = require('express');
const multer = require('multer');
const { uploadFile, getFile, fetchFilesFromTeams } = require('../controllers/fileController');
const auth = require('../auth'); // Import the auth module

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust destination as needed

// Route to upload a file with authentication
router.post('/upload', auth.authenticate, upload.single('file'), uploadFile);

// Route to get a file by filename with authentication
router.get('/:filename', auth.authenticate, getFile);

// Route to fetch files from Microsoft Teams with authentication
router.get('/teams', auth.authenticate, async (req, res) => {
    try {
        const files = await fetchFilesFromTeams();
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files from Teams', error: error.message });
    }
});

module.exports = router;
