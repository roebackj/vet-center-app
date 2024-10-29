import React, { useState, useEffect } from 'react';
import Search from './searchfunction';
import Navigation from './navigation';
import './checklist.css';

const SecurePage = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedDocs, setCheckedDocs] = useState({});
    const [datesChecked, setDatesChecked] = useState({});

    // Function to handle scan data passed from Navigation
    const handleScanData = (result) => {
        setData(result);
    };

    // Function to fetch initial data
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/data/initial');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    // Benefits to required documents mapping
    const requiredDocsMapping = {
        'Chapter 30': ['COE', 'Enrollment Manager', 'Schedule'],
        'Chapter 31': ['Enrollment Manager', 'Schedule'],
        'Chapter 33 Post 9/11': ['COE', 'Enrollment Manager', 'Schedule'],
        'Chapter 35': ['COE', 'Enrollment Manager', 'Schedule'],
        'Fed TA': ['TAR', 'Enrollment Manager', 'Schedule'],
        'State TA': ['Award Letter', 'Enrollment Manager', 'Schedule'],
        'Missouri Returning Heroes': ['DD214', 'Enrollment Manager', 'Schedule'],
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter data based on search term
    const filteredData = data.filter((item) => {
        const fullName = item["Last Name, First Name (Legal Name)"];
        if (!fullName) return false;
        const [lastName, firstName] = fullName.split(',').map(name => name.trim());
        return `${firstName} ${lastName}`.toLowerCase().startsWith(searchTerm.toLowerCase());
    });

    const cleanBenefit = (benefit) => {
        const mapping = {
            'Missouri Returning Heroes': 'Missouri Returning Heroes',
            'Chapter 33 Post 9/11': 'Chapter 33 Post 9/11',
            'Chapter 31 VocRehab': 'Chapter 31',
            'State Tuition Assistance Deadline': 'State TA',
            'Chapter 35': 'Chapter 35',
            'Chapter 30 MGIB': 'Chapter 30',
            'Federal Tuition Assistance Deadline': 'Fed TA',
        };
        return mapping[benefit] || benefit; // Return cleaned benefit or fallback
    };

    const getCleanedBenefits = (benefits) => {
        if (typeof benefits !== 'string') return '';
        return benefits.split(';')
            .map(benefit => benefit.trim())
            .map(cleanBenefit)
            .filter(Boolean)
            .join('; ');
    };

    const getRequiredDocs = (benefitString) => {
        const benefits = getCleanedBenefits(benefitString).split('; ');
        return [...new Set(benefits.flatMap(benefit => requiredDocsMapping[benefit] || []))];
    };

    const handleCheckboxChange = (docId) => {
        setCheckedDocs(prevState => ({
            ...prevState,
            [docId]: !prevState[docId],
        }));
    };

    const updateDate = (studentID) => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`; // Format as MM/DD

        setDatesChecked(prevState => ({
            ...prevState,
            [studentID]: prevState[studentID] ? null : formattedDate,
        }));
    };

    return (
        <div className="secure-page">
            <Navigation onScan={handleScanData} />
            <div className="content">
                <img src="https://i.imgur.com/SROEj2Q.jpeg" alt="Company Logo" className="company-logo" />
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {filteredData.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="red-header">Name</th>
                                <th className="red-header">Student ID</th>
                                <th className="red-header">Benefit</th>
                                <th className="red-header">Required Documents</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => {
                                const fullName = item["Last Name, First Name (Legal Name)"] || 'Unknown';
                                const [lastName, firstName] = fullName.split(',').map(name => name.trim());
                                const displayName = `${firstName}, ${lastName}`;
                                const studentID = item["Student ID # (This is NOT your Social Security Number or SSO ID)"] || 'N/A';
                                const benefits = item["Benefit you plan to utilize this term (check all that apply):"];
                                const requiredDocs = getRequiredDocs(benefits);

                                return (
                                    <tr key={index}>
                                        <td>{displayName}</td>
                                        <td>{studentID}</td>
                                        <td>{getCleanedBenefits(benefits)}</td>
                                        <td>
                                            {requiredDocs.length > 0 ? (
                                                requiredDocs.map((doc, docIndex) => {
                                                    const docId = `${doc}-${studentID}`;
                                                    const isChecked = checkedDocs[docId] || false;

                                                    return (
                                                        <div key={docIndex} className="checkbox-container">
                                                            <input
                                                                type="checkbox"
                                                                id={docId}
                                                                checked={isChecked}
                                                                onChange={() => handleCheckboxChange(docId)}
                                                            />
                                                            <label htmlFor={docId}> {doc} </label>
                                                            <div className={`benefit-box ${isChecked ? 'active' : ''}`} id={`box-${docId}`}>
                                                                <span>{doc}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div>No documents required</div>
                                            )}
                                            <div className="date-container">
                                                <input
                                                    type="checkbox"
                                                    id={`date-${studentID}`}
                                                    onChange={() => updateDate(studentID)}
                                                />
                                                <label htmlFor={`date-${studentID}`}>Date Checked</label>
                                                <div className="date-box" id={`date-box-${studentID}`}>
                                                    {datesChecked[studentID] && (
                                                        <span className="date-checked" id={`date-checked-${studentID}`}>
                                                            {datesChecked[studentID]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>Press the "scan" function for data</p>
                )}
            </div>
        </div>
    );
};

export default SecurePage;

