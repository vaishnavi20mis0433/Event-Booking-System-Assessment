Software Developer Intern:
Event Booking System Assessment

Objective: Create a basic system that tracks bookings for various events using Node.js, TypeScript, Express.js, and MongoDB.
Requirements:
Event and Booking Management:
Implement APIs to create events, book tickets for events, and cancel bookings.
Each event should have a unique identifier, name, date, and total number of tickets.
Each booking should have a unique identifier(Booking ID), user ID, event ID, and timestamp


API Endpoints:
POST /events: Create a new event. The request body should contain the event name, date, and total number of tickets.
POST /bookings: Book tickets for an event. The request body should contain the user ID, quantity and event ID


Booking Limit:
Each user can book a maximum of 15 tickets per booking request. This means that if a user tries to book more than 15 tickets in a single request, the system should only process up to 15 tickets and reject any additional requests in that transaction.


Availability Check:
Before confirming the booking, the system must check if there are enough tickets available for the event. If the event has reached its maximum capacity (i.e., no more tickets are available), the system should prevent further bookings and inform the user that the event is fully booked.


DELETE /bookings/:id: Cancel a booking by ID.
GET /events: Retrieve a list of events with available tickets.
GET /events/:id: Retrieve details of a specific event, including booked tickets and remaining tickets.
POST /print-ticket: This endpoint allows users to print a ticket for a specific booking. It generates a printable format of the ticket, which includes details of the event and booking.


Technical Details:
Use Node.js, TypeScript, Express.js, and MongoDB to build the REST APIs.
Use GitHub for version control.
Ensure the code is modular and easy to understand.


Evaluation Criteria:
Code Quality and Structure: Well-organized and easy-to-read code with descriptive variable names and a clear structure.
Implementation of Required Functionality: Accurate creation of events, booking of tickets, and cancellation of bookings.
Error Handling and Robustness: Graceful handling of unexpected situations with helpful error messages and continued system operation.
Documentation: Clear instructions on how to set up and use the API.
How to submit?
Upon completion, deploy your code to a hosting platform of your choice. Share the deployment link and the GitHub repository link containing the source code to aman@napqueens.com.



## Notes
* backend runs on **localhost:8000/api**
* frontend runs on **localhost:3000**


## Steps
1. Go to mongodb.com and setup a new cluster, new user (with permissions to read/write) and security (IP whitelisting)
https://www.youtube.com/watch?v=ugI1riTacbw


2. update the backend ```nodemon.js``` file with your values
```javascript
"env": {
  "MONGO_USER": "YOUR MONGO USERNAME",
  "MONGO_PASSWORD": "YOUR MONGO PASSWORD",
  "MONGO_DATABASE": "YOUR MONGO DATABASE NAME",
  "JWT_SECRET": "A SECRET YOU DEFINE TO ENCRYPT / DECRYPT PASSWORDS"
}
```

3. Run backend:
 ```bash
cd backend
npm start
```
go to:
```http://localhost:8000/api```


4. Run backend
 ```bash
cd frontend
npm start
```
go to:
```http://localhost:3000/```


5. Play around with the UI
* create an account (can use fake emails, no email confirmations sent)
* login and create some Events
* logout
* create a different account
* login with new account and create some Events
* go back and forth between accounts, create Events and confirm Bookings
