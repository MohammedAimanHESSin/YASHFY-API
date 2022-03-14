const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        res.status(401).json({message: 'Not Authenticated!'});
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
        console.log(err);
    }
    if(!decodedToken) {
        res.status(401).json({message: 'Not Authenticated!'});
    }
    req.patientId = decodedToken.patientId;
    next();
};