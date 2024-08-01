import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import './Events.css';

class EventsPage extends Component {

  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
    isActive: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  // Internal React method 
  // Called immediately after a component is mounted. Setting state here will trigger re-rendering.
  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  }

  modalConfirmHandler = () => {
    this.setState({creating: false});

    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if(title.trim().length === 0 || 
      price <= 0 ||
      date.trim().length === 0 || 
      description.trim().length === 0) {
        return;
    }
  
    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $date: String!, $price: Float!, $desc: String!) {
          createEvent(input: {title: $title, date: $date, price: $price, description: $desc}) {
            _id
            title
            date
            price
            description
          }
        }
      `,
      variables: {
        title: title,
        date: date, 
        price: price, 
        desc: description
      }
    };

    fetch('http://localhost:8000/api', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if(res.status !== 200 && res.status !== 200) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(responseData => {
      this.setState(prevState => {
        const updatedEvents = [...prevState.events];

        updatedEvents.push({
          _id: responseData.data.createEvent._id,
          title: responseData.data.createEvent.title,
          description: responseData.data.createEvent.description,
          price: responseData.data.createEvent.price,
          date: responseData.data.createEvent.date,
          createdBy: {
            _id: this.context.userId
          }
        });

        return { events: updatedEvents };
      })
    })
    .catch(err => {
      console.log(err);
    });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  }

  fetchEvents = () => {

    this.setState({isLoading: true});

    const requestBody = {
      query: `
        query {
          getEvents {
            _id
            title
            description
            price
            date
            createdBy {
              _id
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:8000/api', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if(res.status !== 200 && res.status !== 200) {
        this.setState({ isLoading: false });
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(responseData => {
      if(this.state.isActive) {
        this.setState({ 
          events: responseData.data.getEvents,
          isLoading: false });
      }
    })
    .catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
    });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => { 
      const selectedEvent = prevState.events.find(ev => ev._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  }

  bookEventHandler = () => {

    if(!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    fetch('http://localhost:8000/api', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      if(res.status !== 200 && res.status !== 200) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(responseData => {
      console.log(responseData);
      this.setState({ selectedEvent: null });
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentWillUnmount() {
    this.setState({ isActive: false });
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal 
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText='Confirm'>
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" ref={this.dateElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" rows="4" ref={this.descriptionElRef} />
                </div>
              </form>
          </Modal>
        )}
        {this.context.token && ( 
          <div className="events-control">
            <p>Share your Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
          </div>
        )}
        {
          this.state.selectedEvent 
          &&
            <Modal 
              title={this.state.selectedEvent.title}
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.bookEventHandler}
              confirmText={this.context.token ? 'Book' : 'Confirm'}>
                <h1>{this.state.selectedEvent.title}</h1>
                <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                <p>{this.state.selectedEvent.description}</p>
            </Modal>          
        }
        {
          this.state.isLoading 
          ? <Spinner />
          : <EventList 
              events={this.state.events} 
              authUserId={this.context.userId}
              onViewDetail={this.showDetailHandler} 
            />
        }

      </React.Fragment>
    );
  }
}

export default EventsPage;
