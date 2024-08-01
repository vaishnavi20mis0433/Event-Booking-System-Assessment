const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./transforms');


module.exports = {

  /* 
  query {  
    getEvents {
      date
      createdBy {
        email
        events {
          _id
          title
        }
      }
    }
  }
  */
  getEvents: async() => {
    try {
      const events = await Event
        .find().populate('createdBy')
        .then(events => {
          return events
            .map(event => {
              return transformEvent(event);
            });
        });

      return events;
    }
    catch(err) {
      console.log(err);
      throw err;
    }
  },
 
  /*
    mutation {
      createEvent(input:{
        title:"new title", 
        description:"new description", 
        price:123.45, 
        date:"2019-12-10T01:28:03.044Z"
      })
      {
        _id,
        createdBy {
          email,
          password
        }
      }
    }
  */
  createEvent: async (args, req) => {

    if(!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    const event = new Event({
      title: args.input.title,
      description: args.input.description,
      price: +args.input.price, // adding + assures value is converted to Float
      date: new Date(args.input.date),
      createdBy: req.userId
    });

    let createdEvent;
    try {

      const result = await event.save(); // provided by Mongoose
      createdEvent = result;

      const user = await User.findById('5dedd8202c6c5f2b00bbedb6');
      if(!user) {
        throw new Error('User does not exist');
      }
      
      user.events.push(createdEvent);
      await user.save();

      return transformEvent(createdEvent);
    }
    catch(err) {
      console.log(err);
      throw err;
    };
  }

};