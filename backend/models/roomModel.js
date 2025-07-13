const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7200
  }
});

module.exports = mongoose.model('Room', RoomSchema);
