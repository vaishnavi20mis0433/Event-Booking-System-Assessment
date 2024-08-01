import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    // options -> mongoose will automatically a CreatedAt and UpdatedAt to every entry recorded 
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);