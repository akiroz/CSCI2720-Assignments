var crypto = require('crypto');
var querystring = require('querystring');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// login handler ==============================================
app.post('/login', (req, res) => {
  var username = req.body.username;
  var pHash = crypto.createHash('sha256');
  pHash.update(req.body.password);

  db.query(
    'SELECT balance FROM user WHERE username = ? AND password = ?',
    [username, pHash.digest('hex')],
    (err, results) => {
      if(err) throw err;

      if(results.length) {
        if(username === 'admin') {
          // login as admin
          res.redirect('/admin.html');
        } else {
          // login as normal user
          res.cookie('username', username);
          res.cookie('balance', results[0].balance);
          res.redirect('/user.html');
        }
      } else {
        // login failed
        var qs = querystring.stringify({
          error: 'Invalid username or password'
        });
        res.redirect(`/?${qs}`);
      }

    }
  );
});

// item CRUD handlers ==============================================
app.post('/item', (req, res) => {
  // Create item
  var { title, description, image, value, qty, tags } = req.body;
  db.query(
    `INSERT INTO item (title,description,image,value,qty,tags) VALUES (?,?,?,?,?,?)`,
    [ title, description, image, value, qty, tags.split(' ') ],
    err => {
      if(err) throw err;
      res.end();
    }
  );
});
app.get('/item', (req, res) => {
  // Retreve item
  var { sortDesc, sortValue, page = 0 } = req.body;
  var sortField = sortValue ? 'value' : 'create_time';
  var sortOrder = sortDesc ? 'DESC' : 'ASC';
  db.query(
    `SELECT * FROM item ORDER BY ${sortField} ${sortOrder} LIMIT 10 OFFSET ?`,
    [ page*10 ],
    (err, results) => {
      if(err) throw err;
      res.json(results);
    }
  )
});
app.put('/item/:id', (req, res) => {
  var { id } = req.param;
  var { title, description, image, value, qty, tags } = req.body;
  // Update item
  db.query(
    'UPDATE item SET title=? description=? image=? value=? qty=? tags=? WHERE id=?',
    [ title, description, image, value, qty, tags, id ],
    err => {
      if(err) throw err;
      res.end();
    }
  );
});
app.delete('/item/:id', (req, res) => {
  // Delete item
  var { id } = req.param;
  db.query('DELETE FROM item WHERE id=?', [id], err => {
    if(err) throw err;
    res.end();
  });
});


// serve static files from public folder
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
  CREATE TABLE IF NOT EXISTS redeem (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(64),
    item_id     INT,
    redeem_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (item_id) REFERENCES item(id)
  );
  INSERT INTO user VALUES (
    'admin',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    0
  ) ON DUPLICATE KEY UPDATE username=username;
  INSERT INTO user VALUES (
    'user',
    '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
    100
  ) ON DUPLICATE KEY UPDATE username=username;
`;

// init DB and start HTTP server
// delay 1.5s for db startup
setTimeout(_ => {
  db.query(initSQL, err => {
    if(err) throw err;
    app.listen(3000, _ => console.log("Server started on port 3000"));
  });
}, 1500);


