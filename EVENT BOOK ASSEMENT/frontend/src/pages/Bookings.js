import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';

class BookingPage extends Component {

  state = {
    isLoading: true,
    bookings: [],
    isActive: true,
    outputType: 'list'
  }

  static contextType = AuthContext;

  componentDidMount() { 
    this.fetchBookings();
  }

  fetchBookings = () => {

    this.setState({isLoading: true});

    const requestBody = {
      query: `
        query {
          getBookings {
            _id
            createdAt
            event {
              _id
              title
              price
            }
          }
        }
      `
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
        this.setState({ isLoading: false });
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(responseData => {
      if(this.state.isActive) {
        this.setState({ 
          bookings: responseData.data.getBookings,
          isLoading: false
        });
      }
    })
    .catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
    });
  }

  deleteBookingHandler = bookingId => {

    this.setState({isLoading: false});

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
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
    .then(() => {
      this.setState(prevState => { 
        const updatedBookings = prevState.bookings.filter(b =>{
          return bookingId._id !== b._id;
        });

        return { 
          bookings: updatedBookings,
          isLoading: false
        }
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({ isLoading: false });
    });
  }

  componentWillUnmount() {
    this.setState({ isActive: false });
  }

  changeOutputTypeHandler = output => {
    if(output === 'list') {
      this.setState({ outputType: 'list' });
    }
    else {
      this.setState({ outputType: 'chart' });
    }
  }

  render() {
    let content = <Spinner />;
    if(!this.state.isLoading) {
      content = 
        <React.Fragment>
          <BookingsControls activeOutputType={this.state.outputType} onChange={this.changeOutputTypeHandler} />
          <div>
            {
              this.state.outputType === 'list' 
              ? <BookingList bookings={ this.state.bookings } onDelete={ this.deleteBookingHandler } />
              : <BookingsChart bookings={ this.state.bookings } />
            }
          </div>
        </React.Fragment>
    }

    return (
      <React.Fragment>
        { content }
      </React.Fragment>);
  }
}

export default BookingPage;