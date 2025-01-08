import React, { useState } from 'react';
import axios from 'axios';

const UploadLatestReport = ({ eventId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('report', file);
    formData.append('eventId', eventId);

    try {
      const response = await axios.post('http://localhost:5000/api/reports/upload-report', formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading report:', error);
      setMessage('Failed to upload report');
    }
  };

  return (
    <div>
      <h3>Upload Latest Report</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadLatestReport;
