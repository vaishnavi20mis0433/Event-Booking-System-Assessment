import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// defines the structure of a User obj throughout the entire app
const userSchema = new Schema({
  email:  {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true
  },
  //sets up a relation between entities (much like a FK)
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event' //name 'Event' from module.export from **event.js**
    }
  ]
});

// needs to be exported to wherever it's consumed
module.exports = mongoose.model('User', userSchema);
