const jwt = require('jsonwebtoken')


module.exports = (req, res, next)=>{
const authHeader = req.get('Authorization')

console.log("The Token is : ", authHeader)

if (!authHeader) {
  const error = new Error('Not authenticated.');
  error.statusCode = 401;
  throw error;
}
const token = authHeader.split(' ')[1];

let decodedToken;
try {
  decodedToken = jwt.verify(token, 'yashfy-secret-key');
} 
catch (err) {
  err.statusCode = 500;
  throw err;
}

if (!decodedToken) {
  const error = new Error('Not authenticated.');
  error.statusCode = 401;
  throw error;
}

req.userId = decodedToken.userId;
next();
};
