import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CampusBuzz.css';

const CampusBuzz = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const downloadReport = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports?id=${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <div className="campus-buzz">
      <h2>Event Reports</h2>
      <div className="reports-container">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <h3>{report.event_name}</h3>
              <p>{report.description}</p>
              <p><strong>Submitted on:</strong> {new Date(report.submission_date).toLocaleString()}</p>
              <button onClick={() => downloadReport(report.id)}>Download Report</button>
            </div>
          ))
        ) : (
          <p>No reports available</p>
        )}
      </div>
    </div>
  );
};

export default CampusBuzz;
