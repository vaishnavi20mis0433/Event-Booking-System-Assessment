import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
const User = require('../../models/user');


module.exports = {

  createUser: async args => {
    
    try {
      const existingUser = await User.findOne({ email: args.input.email });
      if(existingUser) {
        throw new Error('User exists already');
      }
      
      const hashedPassword = await bcrypt.hash(args.input.password, 12);

      const newUser = new User({
        email: args.input.email,
        password: hashedPassword
      });
      
      const result = await newUser.save();
      return { ...result._doc, password: null };
    }
    catch(err) {
      console.log(err);
      throw err;
    }
  },

  /*
  query {
    login(email:"john@test.com", password:"password") {
      userId
      token
      tokenExpiration
    } 
  }
  */
  login: async ({email, password}) => {
    try {
      const user = await User.findOne({ email: email });
      if(!user) {
        throw new Error('User does not exist');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if(!isEqual) {
        throw new Error('Password is incorrect');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' });

      return { userId: user.id, token: token, tokenExpiration: 1 };
    }
    catch(err) {
      console.log(err);
      throw err;
    }
  }
};