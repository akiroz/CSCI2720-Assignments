// You need to "require" persons.js in this file to access the array of persons

module.exports = function(req, res) {

  // Retrieve the "person" object from the request.
  // You may assume the "person" object is valid
  // Let Q be this object
  let Q = JSON.parse(req.body);

  // Let P be the array of persons
  let P = require('./persons.js');

  // Replace P[i] by Q if P[i].index == Q.index
  let exists = P[Q.index];
  if(exists) P[Q.index] = Q;

  // Send 1 in the body of the response if a replacement successfully
  // took place.
  // Otherwise, send 0 in the body of the response.
  res.json([exists?1:0])
}
