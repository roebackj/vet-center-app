// routes/pdfRoutes.js
const express = require('express');
const { uploadPdf, getPdfs, fetchPdfsFromSharePoint, checkDocumentsForBenefit } = require('../controllers/pdfController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust destination as needed

// Route to upload a PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Route to get PDFs
router.get('/', getPdfs);

// Route to fetch PDFs from SharePoint
router.get('/sharepoint', async (req, res) => {
    try {
        const pdfs = await fetchPdfsFromSharePoint(); // Fetch PDFs from SharePoint
        res.json(pdfs); // Return the fetched PDFs
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs from SharePoint', error: error.message });
    }
});

// Route to check documents for a specific benefit
router.get('/benefit-documents/:benefit', async (req, res) => {
    try {
        const documents = await checkDocumentsForBenefit(req.params.benefit); // Get documents for the benefit
        res.json(documents); // Return the documents found
    } catch (error) {
        res.status(500).json({ message: 'Error checking documents for benefit', error: error.message });
    }
});

module.exports = router;


