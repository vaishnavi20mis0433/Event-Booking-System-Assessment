const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
  const authHeader = req.get('Authorization');
  if(!authHeader) {
    // TODO
    req.isAuth = false; // [isAuth] doesn't exist in request, adding it here
    return next();
  }
  
  const token = authHeader.split(' '); // Authorization: Bearer token_value
  if(!token || token === '' || token.length != 2) {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token[1], process.env.JWT_SECRET);
    if(!decodedToken) {
      req.isAuth = false;
      return next();
    }
  }
  catch(err) {
    console.error(err);
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}