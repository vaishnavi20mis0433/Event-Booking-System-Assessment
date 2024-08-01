# Events Booking Api using Graphql ![GraphQL](https://img.icons8.com/color/48/000000/graphql.png), Node.js (Express) ![Node](https://img.icons8.com/color/48/000000/nodejs.png), React ![React](https://img.icons8.com/ultraviolet/48/000000/react.png) & MongoDb ![MongoDb](https://img.icons8.com/color/48/000000/mongodb.png)


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
