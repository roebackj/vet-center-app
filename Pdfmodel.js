// models/PdfModel.js
class Pdf {
    constructor(title, filePath) {
        this.title = title;       // Title of the PDF
        this.filePath = filePath; // Path to the PDF in Teams
    }
}

module.exports = Pdf;
