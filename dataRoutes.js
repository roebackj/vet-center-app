const express = require('express');
const { fetchNamesAndDocuments } = require('../controllers/dataController');
const router = express.Router();

// Route to fetch names and documents based on the Excel file and selected benefit
router.get('/names-documents', async (req, res) => {
    try {
        const namesAndDocuments = await fetchNamesAndDocuments(); // Implement this in your dataController
        res.json(namesAndDocuments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching names and documents', error: error.message });
    }
});

module.exports = router;





