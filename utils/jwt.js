const jwt = require('jsonwebtoken');

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

exports.createToken = (data) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });