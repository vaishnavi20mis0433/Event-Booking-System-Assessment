const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');

const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({_id: {$in: userIds}});
  //return User.find().where('_id').in(userIds).exec();
});


const events = async eventIds => {
  try {
    //const events = await Event.find({ _id: { $in: eventIds } });
    const events = await Event.find().where('_id').in(eventIds).exec();
    events.sort((x, y) => {
      return eventIds.indexOf(x._id.toString()) - eventIds.indexOf(y._id.toString());
    });

    return events.map(event => {
      return transformEvent(event);
    });
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId);
    return event;
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId);

    return {
      ...user._doc,
      password: null,
      events: () => eventLoader.loadMany(user._doc.events)
    }
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}


const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    createdBy: userLoader.load(event._doc.createdBy)
  }
}

const transformBooking = booking => {
  return {
    ...booking._doc,
    event: singleEvent.bind(this, booking._doc.event),
    user: user.bind(this, booking._doc.user),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
}


exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
