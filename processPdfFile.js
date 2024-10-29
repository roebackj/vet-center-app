// utils/processPdfFile.js
const fs = require('fs');
const path = require('path');
const pdfParser = require('pdf-parse'); // Use a library to parse PDF files

async function processPdfFile(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParser(dataBuffer);

        // Here you can implement logic to extract relevant information
        // For example, parse the PDF text and extract necessary fields

        console.log(`Processed PDF: ${filePath}`);
        return pdfData.text; // Return the text content of the PDF
    } catch (error) {
        console.error(`Error processing PDF: ${filePath}`, error.message);
        throw new Error('Failed to process PDF file');
    }
}

module.exports = { processPdfFile };

