import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// defines the structure of an Event obj throughout the entire app
const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description:  {
    type: String,
    required: true
  },
  price:  {
    type: Number,
    required: true
  },
  date:  {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// needs to be exported to wherever it's consumed
module.exports = mongoose.model('Event', eventSchema);
