var crypto = require('crypto');
var mysql = require('mysql');
var express = require('express');

// config database
var db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: '19WindowsSucks',
  database: 'CSCI2720',
  multipleStatements: true
});

// config app
var app = express();
app.get('/ping', (req, res) => {
  res.send('pong');
});
app.use(express.static('public'))

var initSQL = `
  CREATE TABLE IF NOT EXISTS item (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    title       TEXT,
    description TEXT,
    image       BLOB,
    value       INT,
    qty         INT,
    tags        JSON,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS user (
    username  VARCHAR(64) PRIMARY KEY,
    password  TEXT,
    balance   INT
  );
  INSERT INTO user VALUES (
    'admin',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    0
  ) ON DUPLICATE KEY UPDATE username=username;
`;

// init DB and start HTTP server
db.query(initSQL, err => {
  if(err) throw err;
  app.listen(3000, _ => console.log("Server started on port 3000"));
});


