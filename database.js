const axios = require('axios');
require('dotenv').config();

// Function to get access token
const getAccessToken = async () => {
    const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    try {
        const response = await axios.post(url, params);
        return response.data.access_token;
    } catch (error) {
        console.error('Error retrieving access token:', error.message);
        throw new Error('Error retrieving access token');
    }
};

// Function to fetch files from Microsoft Teams
const fetchFilesFromTeams = async () => {
    const accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/me/drive/root/children`; // Adjust this path if needed

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.value; // This contains the list of files
    } catch (error) {
        console.error('Error fetching files from Teams:', error.message);
        throw new Error('Failed to fetch files from Teams');
    }
};

// Function to filter documents by type (e.g., PDFs, Excel files)
const filterFilesByType = (files, type) => {
    return files.filter(file => file.name.endsWith(type));
};

// Function to fetch Excel files for scanning
const fetchExcelFiles = async () => {
    const files = await fetchFilesFromTeams();
    return filterFilesByType(files, '.xlsx'); // Adjust the extension based on what you need
};

// Function to fetch PDF files
const fetchPdfFiles = async () => {
    const files = await fetchFilesFromTeams();
    return filterFilesByType(files, '.pdf'); // Fetch PDF files
};

module.exports = { fetchFilesFromTeams, fetchExcelFiles, fetchPdfFiles };


