const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformBooking } = require('./transforms');
const { transformEvent } = require('./transforms');

module.exports = {

  /*
    query {      
      getBookings {
        _id
        event {
          _id
        }
        user {
          _id
          email
          events {
            _id
          }
        }
      }
    }  
  */
  getBookings: async(args, req) => {

    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings
        .map(booking => {
          return transformBooking(booking);
        });
    }
    catch(err) {
      console.log(err);
      throw err;
    }
  },

  /*
    mutation {
      bookEvent(eventId: "5deef56a8f45314c18dc7ff3") {
        _id
        user {
          email
        }
      }
    }
  */
  bookEvent: async (args, req) => {

    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const fetchedEvent = await Event.findOne({_id: args.eventId});
      if(!fetchedEvent) {
        throw new Error('Event does not exist');
      }

      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent
      });

      const result = await booking.save();
      return transformBooking(result);
    }
    catch(err) {
      console.log(err);
      throw err;
    }
  },

  /*
    mutation {
      cancelBooking(bookingId: "5deef6080018cb102856f98c") {
        createdBy {
          email
          password
        }
      }
    }
  */  
  cancelBooking: async (args, req) => {

    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    
    try {
      const booking = await Booking
                        .findById(args.bookingId)
                        .populate('event');
      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    }
    catch(err) {
      console.log(err);
      throw err;
    }
  }

};