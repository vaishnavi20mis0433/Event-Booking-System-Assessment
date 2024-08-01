import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const eventList = props => {
    
  const events = props.events.map(ev => {

    return (
      <EventItem 
        key={ev._id} 
        eventId={ev._id} 
        title={ev.title} 
        price={ev.price}
        date={ev.date}
        description={ev.description} 
        authUserId={props.authUserId} 
        createdById={ev.createdBy._id}
        onDetail={props.onViewDetail}
      />);
  });

  return <ul className="event__list">{events}</ul>;
};

export default eventList;