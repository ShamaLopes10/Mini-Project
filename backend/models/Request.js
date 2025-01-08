const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EventRequest = sequelize.define('EventRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  organizer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizer_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizer_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  club_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  event_details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  venue_requested: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  event_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expected_audience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'eventrequests',
  timestamps: false, // Disable Sequelize auto-created timestamps
});

module.exports = EventRequest;
