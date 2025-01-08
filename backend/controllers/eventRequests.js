const { getApprovedRequests } = require('../models/EventRequest');

exports.viewApprovedRequests = async (req, res) => {
    try {
      const { role } = req.query;
  
      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }
  
      const requests = await getApprovedRequests(role);
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching approved requests:', error);
      res.status(500).json({
        message: 'Error fetching approved requests',
        error: error.message || 'Unknown error',
      });
    }
  };
  
