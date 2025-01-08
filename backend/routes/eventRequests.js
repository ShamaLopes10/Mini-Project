const express = require('express');
const { viewApprovedRequests } = require('../controllers/eventRequests');
const router = express.Router();

router.get('/approved-requests', viewApprovedRequests);

module.exports = router;
