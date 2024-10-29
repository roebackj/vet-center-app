import React, { useState } from 'react';
import './navigation.css';

const Navigation = ({ onScan }) => {
    const [modal, setModal] = useState('');
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state for fetch operations
    const [error, setError] = useState(''); // Error state for feedback

    const openModal = (modalName) => {
        setModal(modalName);
        if (modalName === 'schedule') {
            fetchPdfs();
        }
    };

    const closeModal = () => {
        setModal('');
        setPdfs([]);
        setError(''); // Clear error on close
    };

    const fetchPdfs = async () => {
        setLoading(true); // Set loading state
        try {
            const response = await fetch('http://localhost:3000/api/pdfs');
            const data = await response.json();
            if (response.ok) {
                if (data.length > 0) {
                    setPdfs(data);
                } else {
                    setError('No PDFs available.');
                }
            } else {
                setError('Failed to fetch PDFs.');
            }
        } catch (error) {
            setError('Error fetching PDFs. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const fetchScanData = async () => {
        setLoading(true); // Set loading state
        try {
            const response = await fetch('http://localhost:3000/api/data/scan');
            const result = await response.json();
            if (response.ok) {
                onScan(result); // Pass the fetched data to the parent component
            } else {
                setError('Failed to fetch scan data.');
            }
        } catch (error) {
            setError('Error fetching scan data. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const instructions = {
        scan: "Instructions for Scan",
        coe: "Instructions for COE",
        enrollment: "Instructions for Enrollment MG",
        schedule: "Instructions for Schedule",
        dd214: "Instructions for DD214",
        tar: "Instructions for TAR",
        awardLetter: "Instructions for Award Letter",
    };

    return (
        <div className="navbar">
            <div className="container">
                <div onClick={fetchScanData} className="box box-scan">Scan</div>
                <div onClick={() => openModal('coe')} className="box">COE</div>
                <div onClick={() => openModal('enrollment')} className="box">Enrollment MG</div>
                <div onClick={() => openModal('schedule')} className="box">Schedule</div>
                <div onClick={() => openModal('dd214')} className="box">DD214</div>
                <div onClick={() => openModal('tar')} className="box">TAR</div>
                <div onClick={() => openModal('awardLetter')} className="box">Award Letter</div>
            </div>
            {modal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{instructions[modal]}</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            modal === 'schedule' && (
                                <div>
                                    {pdfs.length > 0 ? (
                                        pdfs.map((pdf, index) => (
                                            <iframe
                                                key={index}
                                                src={`http://localhost:3000/${pdf.filePath}`}
                                                width="100%"
                                                height="600px"
                                                title={`PDF ${index + 1}`}
                                            ></iframe>
                                        ))
                                    ) : (
                                        <p>No PDFs available.</p>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;
