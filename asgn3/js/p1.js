// You need to "require" persons.js in this file to access the array of persons

module.exports = function(req, res) {

  // Retrieve the "prefix" string from the request
  // Let S be this string
  var S = req.query.prefix;

  // Let P be the array of persons
  var P = require('./persons.js');

  // Create an empty array, Q
  var Q = [];

  // Append P[i] to Q if S is a prefix of P[i].name
  // Note: Empty string is treated as a prefix for all strings
  P.forEach(p => {
    if(p.name.startsWith(S)) {
      Q.push(p);
    }
  });

  // Send Q in the body of the response
  res.json(Q);
}
