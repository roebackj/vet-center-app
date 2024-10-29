// services/PdfService.js
const axios = require('axios');
const Pdf = require('../models/PdfModel'); // Make sure this path is correct
const { getAccessToken } = require('../utils/auth'); // Adjust the path as necessary

// Fetch PDFs from Microsoft Teams
const fetchPdfsFromTeams = async () => {
    const accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/me/drive/root/children`; // Adjust URL if necessary

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data.value
            .filter(file => file.name.endsWith('.pdf')) // Filter for PDF files
            .map(file => new Pdf(file.name, file['@microsoft.graph.downloadUrl'])); // Create Pdf instances
    } catch (error) {
        console.error('Error fetching PDFs from Teams:', error.message);
        throw new Error('Failed to fetch PDFs from Teams');
    }
};

module.exports = { fetchPdfsFromTeams };


