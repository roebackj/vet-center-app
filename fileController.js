const axios = require('axios');
const { getAccessToken } = require('../auth'); // Import the access token function
const FormData = require('form-data'); // Import FormData for file uploads
const auth = require('../auth'); // Import authentication middleware

// Function to upload files to Microsoft Teams
const uploadFile = async (req, res) => {
    const { file } = req; // Assuming you're using multer or similar for file uploads
    if (!file) {
        return res.status(400).json({ message: 'No file provided' });
    }

    try {
        const accessToken = await getAccessToken();
        const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${file.originalname}:/content`; // Adjust path as needed

        const form = new FormData();
        form.append('file', file.buffer, file.originalname); // Add the file to the form data

        const response = await axios.put(url, form, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': `application/octet-stream`,
                ...form.getHeaders(), // Include FormData headers
            },
        });

        res.status(201).json({ message: 'File uploaded successfully', file: response.data });
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

// Function to get files from Microsoft Teams
const fetchFilesFromTeams = async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const url = `https://graph.microsoft.com/v1.0/me/drive/root/children`; // Adjust URL as necessary

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        res.status(200).json(response.data.value); // Return the list of files
    } catch (error) {
        console.error('Error fetching files from Teams:', error.message);
        res.status(500).json({ message: 'Failed to fetch files from Teams', error: error.message });
    }
};

// Function to retrieve a specific file by filename
const getFile = async (req, res) => {
    const { filename } = req.params;

    try {
        const accessToken = await getAccessToken();
        const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${filename}:/content`; // Adjust URL to get the specific file

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/octet-stream',
            },
            responseType: 'arraybuffer',
        });

        // Set the correct content type based on the file type (you may want to enhance this)
        res.set('Content-Type', 'application/pdf'); // Adjust based on file type
        res.send(response.data);
    } catch (error) {
        console.error('Error retrieving file:', error.message);
        res.status(500).json({ message: 'Error retrieving file', error: error.message });
    }
};

// Export functions (you can also export the authenticate middleware if needed)
module.exports = { uploadFile, fetchFilesFromTeams, getFile };
