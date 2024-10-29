require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const chokidar = require('chokidar');
const { processPdfFile } = require('./utils/processPdfFile');
const fileRoutes = require('./routes/fileRoutes'); // File-related routes
const dataRoutes = require('./routes/dataRoutes'); // Data-related routes
const authRoutes = require('./routes/authRoutes'); // Auth-related routes
const pdfRoutes = require('./routes/pdfRoutes'); // PDF-related routes

const app = express();
const port = process.env.PORT || 3000; // Port from env or default to 3000

// Enable CORS for React
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Adjust path if necessary
});

// Routes
app.use('/api/files', fileRoutes); // Routes for handling SharePoint files
app.use('/api/data', dataRoutes); // Data fetching routes
app.use('/api/auth', authRoutes); // User authentication routes
app.use('/api/pdfs', pdfRoutes); // PDF handling routes

// Watch for new PDFs manually added to the "uploads" directory
const watcher = chokidar.watch(path.join(__dirname, 'uploads'), {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true
});

watcher.on('add', async (filePath) => {
    console.log(`File added: ${filePath}`);
    
    // Check if it's a PDF
    if (path.extname(filePath) !== '.pdf') return;

    try {
        // Process the new PDF file (ensure consistent handling)
        await processPdfFile(filePath);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



