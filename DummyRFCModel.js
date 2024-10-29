// Define a simple class or structure for RFC data
class DummyRFC {
    constructor(lastName, firstName, studentId, benefitChosen, requiredDocuments) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.studentId = studentId;
        this.benefitChosen = benefitChosen;
        this.requiredDocuments = requiredDocuments || [];
    }
}

module.exports = DummyRFC;
