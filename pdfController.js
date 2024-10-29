const Pdf = require('../models/PdfModel'); // Import the Pdf model
const axios = require('axios');
const { getAccessToken } = require('./auth'); // Import the access token function
const { fetchPdfsFromTeams } = require('../services/PdfService'); // Service to fetch PDFs

// Function to upload a PDF to Microsoft Teams
const uploadPdf = async (req, res) => {
    const { file } = req; // Assuming you're using multer or similar for file uploads
    if (!file) {
        return res.status(400).json({ message: 'No PDF file provided' });
    }

    const accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.originalname}:/content`; // Adjust path as needed

    try {
        const response = await axios.put(url, file.buffer, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/pdf',
            },
        });

        res.status(201).json({ message: 'PDF uploaded successfully', file: response.data });
    } catch (error) {
        console.error('Error uploading PDF:', error.message);
        res.status(500).json({ message: 'Error uploading PDF', error: error.message });
    }
};

// Function to get PDFs from Microsoft Teams
const getPdfs = async (req, res) => {
    try {
        const pdfs = await fetchPdfsFromTeams(); // Fetch PDFs directly from Teams
        res.json(pdfs);
    } catch (error) {
        console.error('Error retrieving PDFs:', error.message);
        res.status(500).json({ message: 'Error retrieving PDFs', error: error.message });
    }
};

// Function to fetch PDFs from SharePoint (if needed)
const fetchPdfsFromSharePoint = async () => {
    const accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/sites/{site-id}/drive/root/children`; // Adjust URL to fetch PDFs

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.value.filter(file => file.name.endsWith('.pdf')); // Filter for PDF files
    } catch (error) {
        console.error('Error fetching PDFs from SharePoint:', error.message);
        throw new Error('Failed to fetch PDFs from SharePoint');
    }
};

// Function to check for documents based on the selected benefit
const checkDocumentsForBenefit = async (benefit) => {
    // Implement logic to check for documents related to the specified benefit
    const pdfs = await getPdfs(); // Fetch PDFs from Teams
    // Filter or check against the benefit criteria
    const relevantDocuments = pdfs.filter(pdf => pdf.benefit === benefit);
    return relevantDocuments;
};

module.exports = { uploadPdf, getPdfs, fetchPdfsFromSharePoint, checkDocumentsForBenefit };

