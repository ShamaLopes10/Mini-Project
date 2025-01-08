import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ requestId }) => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('poster');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await axios.post(`http://localhost:5000/api/upload?requestId=${requestId}`, formData);
      alert(`${type} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
    }
  };

  return (
    // 
    <form onSubmit={handleSubmit}>
    <label>
      Upload Report:
      <input type="file" onChange={handleFileChange} required />
    </label>
    <button type="submit">Upload</button>
  </form>
  );
};

export default UploadForm;
