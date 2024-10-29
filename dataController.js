const axios = require('axios');
const { getAccessToken } = require('./teamsService'); // Ensure this path is correct
const xlsx = require('xlsx');

// Function to fetch names and documents from Excel files in Teams
const fetchNamesAndDocuments = async (req, res) => {
    try {
        const files = await fetchFilesFromTeams();
        const excelFiles = files.filter(file => file.name.endsWith('.xlsx'));

        const results = [];

        for (const file of excelFiles) {
            const fileData = await getExcelData(file.id);
            fileData.forEach(row => {
                const documents = row.Documents ? row.Documents.split(',').map(doc => doc.trim()) : []; // Assuming documents are comma-separated
                results.push({
                    lastName: row.LastName,
                    firstName: row.FirstName,
                    studentId: row.StudentID,
                    benefit: row.Benefit,
                    documents // array of documents
                });
            });
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching names and documents:', error.message);
        res.status(500).json({ message: 'Error fetching names and documents', error: error.message });
    }
};

// Function to get data from an Excel file
const getExcelData = async (fileId) => {
    const accessToken = await getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/tables`;

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const tables = response.data.value; // Get the tables
    if (tables.length === 0) {
        throw new Error('No tables found in the Excel file');
    }

    const firstTable = tables[0].id; // Get the ID of the first table
    const rowsResponse = await axios.get(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/tables/${firstTable}/rows`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return rowsResponse.data.value; // Return the rows from the first table
};

// Function to fetch files from a specific Teams channel
const fetchFilesFromTeams = async () => {
    const accessToken = await getAccessToken();
    const teamId = '734d50e9-71e2-42be-b2e9-0535ab4c1911'; // Your Team ID
    const channelId = '19:zao7M5_dE7Y-GyzBSjjKJj_PecPy5WTRZttxerGDI2M1@thread.tacv2'; // Your Channel ID

    const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/filesFolder`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Now fetch the actual files in that folder
        const folderId = response.data.id; // Get the folder ID
        const filesResponse = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/filesFolder/children`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return filesResponse.data.value; // This contains the list of files
    } catch (error) {
        console.error('Error fetching files from Teams:', error.message);
        throw new Error('Failed to fetch files from Teams');
    }
};

module.exports = { fetchNamesAndDocuments };



